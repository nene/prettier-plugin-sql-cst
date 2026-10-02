import dedent from "dedent-js";
import {
  pretty,
  testBigquery,
  testPlpgsql,
  testPostgresql,
} from "../test_utils";

describe("PL/pgSQL EXECUTE embedding", () => {
  it("formats a dollar-quoted command inside DO, with INTO and USING", async () => {
    const input =
      "DO $$BEGIN EXECUTE $sql$select id,tag from tags where id=$1$sql$ INTO result USING 1; END$$";
    const expected = dedent`
      DO $$
      BEGIN
        EXECUTE
          $sql$
            SELECT id, tag FROM tags WHERE id = $1;
          $sql$
        INTO result
        USING 1;
      END;
      $$
    `;
    expect(await pretty(input, { dialect: "postgresql" })).toBe(expected);
    await testPostgresql(expected);
  });

  it("formats RETURN QUERY EXECUTE with an untagged delimiter", async () => {
    expect(
      await pretty(
        "RETURN QUERY EXECUTE $$select id from tags where id=$1$$ USING 1",
        {
          dialect: "plpgsql",
        },
      ),
    ).toBe(dedent`
      RETURN QUERY EXECUTE
        $$
          SELECT id FROM tags WHERE id = $1;
        $$
        USING 1
    `);
  });

  it("preserves data literals and USING arguments", async () => {
    expect(
      await pretty(
        "EXECUTE $sql$select $data$select   x,y$data$, 'a''b', $1$sql$ USING $data$select   2$data$",
        {
          dialect: "plpgsql",
        },
      ),
    ).toBe(dedent`
      EXECUTE
        $sql$
          SELECT $data$select   x,y$data$, 'a''b', $1;
        $sql$
      USING $data$select   2$data$
    `);
  });

  it("does not introduce dollar delimiters through nested embedding", async () => {
    expect(
      await pretty(
        "DO $$BEGIN EXECUTE $sql$create function f() returns text language sql as 'select ''value'''$sql$; END$$",
        {
          dialect: "postgresql",
        },
      ),
    ).toBe(dedent`
      DO $$
      BEGIN
        EXECUTE
          $sql$
            CREATE FUNCTION f()
            RETURNS text
            LANGUAGE sql
            AS 'select ''value''';
          $sql$;
      END;
      $$
    `);
  });

  it.each([
    "EXECUTE $sql$select   id from $sql$ || table_name",
    "EXECUTE format($sql$select   id from %I$sql$, table_name)",
    "EXECUTE command",
    "EXECUTE 'select   1'",
    "EXECUTE E'select   1'",
    "EXECUTE $sql$unsupported SQL syntax$sql$",
  ])("preserves commands it cannot embed: %s", async (source) => {
    await testPlpgsql(source);
  });
});

describe("BigQuery EXECUTE IMMEDIATE embedding", () => {
  it("formats a command with INTO and named parameters", async () => {
    expect(
      await pretty('EXECUTE IMMEDIATE "select @id" INTO result USING 1 AS id', {
        dialect: "bigquery",
      }),
    ).toBe(dedent`
      EXECUTE IMMEDIATE
        r'''
          SELECT @id;
        '''
      INTO result
      USING 1 AS id
    `);
  });

  it("preserves backslashes when quoting the formatted command", async () => {
    expect(
      await pretty(String.raw`EXECUTE IMMEDIATE r"select '\n'"`, {
        dialect: "bigquery",
      }),
    ).toBe(
      dedent(String.raw`
      EXECUTE IMMEDIATE
        r'''
          SELECT '\n';
        '''
    `),
    );
  });

  it("uses double quotes when the command contains triple single quotes", async () => {
    expect(
      await pretty(`EXECUTE IMMEDIATE ${JSON.stringify(`select "'''"`)}`, {
        dialect: "bigquery",
      }),
    ).toBe(dedent`
      EXECUTE IMMEDIATE
        r"""
          SELECT "'''";
        """
    `);
  });

  it("preserves commands containing both triple-quote delimiters", async () => {
    await testBigquery(
      `EXECUTE IMMEDIATE ${JSON.stringify(`select "'''", '"""'`)}`,
    );
  });

  it.each([
    'EXECUTE IMMEDIATE "select " || column_name',
    'EXECUTE IMMEDIATE "unsupported SQL syntax"',
  ])("preserves commands it cannot embed: %s", async (source) => {
    await testBigquery(source);
  });
});
