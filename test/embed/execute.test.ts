import dedent from "dedent-js";
import { pretty, rawPretty, testPlpgsql, testPostgresql } from "../test_utils";

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

  it("formats the command in a FOR loop", async () => {
    expect(
      await pretty(
        "FOR row IN EXECUTE $query$select id from tags$query$ LOOP RETURN NEXT row; END LOOP",
        {
          dialect: "plpgsql",
        },
      ),
    ).toBe(dedent`
      FOR row IN EXECUTE
        $query$
          SELECT id FROM tags;
        $query$ LOOP
        RETURN NEXT row;
      END LOOP
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

  it("respects disabled embedded-language formatting", async () => {
    const source = "EXECUTE $sql$select   1$sql$;\n";
    expect(
      await rawPretty(source, {
        dialect: "plpgsql",
        embeddedLanguageFormatting: "off",
      }),
    ).toBe(source);
  });

  it("passes width, casing and semicolon options to the SQL printer", async () => {
    const output = await rawPretty(
      "EXECUTE $sql$select generated_at,total_applications,new_applications_last_7_days from metrics.metric_cases$sql$",
      {
        dialect: "plpgsql",
        printWidth: 60,
        sqlKeywordCase: "lower",
        sqlFinalSemicolon: false,
      },
    );
    expect(output).toBe(
      dedent`
      execute
        $sql$
          select
            generated_at,
            total_applications,
            new_applications_last_7_days
          from metrics.metric_cases
        $sql$
    ` + "\n",
    );
  });
});
