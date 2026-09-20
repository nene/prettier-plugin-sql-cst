import * as prettier from "prettier";
import * as plugin from "../src";

const format = (sql: string, options: prettier.Options = {}) =>
  prettier.format(sql, { parser: "psql", plugins: [plugin], ...options });

describe("psql", () => {
  it("formats SQL and preserves command lines and arguments", async () => {
    expect(
      await format(
        "\\set ON_ERROR_STOP on\n\\if :ready\nselect 1;\n  \\echo 'it works' :name\n\\else\n  \\quit\n\\endif\n",
      ),
    ).toBe(
      "\\set ON_ERROR_STOP on\n\\if :ready\nSELECT 1;\n  \\echo 'it works' :name\n\\else\n  \\quit\n\\endif\n",
    );
  });

  it.each(["g", "gset result_", "gexec", "watch 1"])(
    "does not insert a semicolon before \\%s",
    async (command) => {
      expect(await format(`select 1 as result\n\\${command}\n`)).toBe(
        `SELECT 1 AS result\n\\${command}\n`,
      );
    },
  );

  it("preserves existing semicolons and blank lines", async () => {
    expect(await format("select 1;\n\n\\gset\n\nselect 2\n")).toBe(
      "SELECT 1;\n\n\\gset\n\nSELECT 2\n",
    );
  });

  it.each([
    "'hello\n\\quit\nworld'",
    '"hello\n\\quit\nworld"',
    "$sql$hello\n\\quit\nworld$sql$",
    "$$hello\n\\quit\nworld$$",
    "E'hello\\'\n\\quit\nworld'",
  ])("keeps apparent commands inside %s", async (value) => {
    const output = await format(`select ${value};\n\\quit\n`);
    expect(output).toContain(value);
    expect(output).toMatch(/^SELECT\s/);
    expect(output).toMatch(/;\n\\quit\n$/);
  });

  it("keeps apparent commands inside nested comments", async () => {
    const comment = "/* outer /* inner */\n\\quit\n*/";
    expect(await format(`${comment}\nselect 1;\n\\quit\n`)).toBe(
      `${comment}\nSELECT 1;\n\\quit\n`,
    );
  });

  it.each(["select :'value';\n", "select 1 \\gset\n"])(
    "preserves SQL fragments it cannot parse",
    async (sql) => {
      expect(await format(sql)).toBe(sql);
    },
  );

  it("preserves query fragments across conditional commands", async () => {
    expect(
      await format("select\n\\if :ready\n1\n\\else\n2\n\\endif\n;\n"),
    ).toBe("SELECT\n\\if :ready\n1\n\\else\n2\n\\endif\n;\n");
  });

  it.each([
    "COPY widgets FROM STDIN;\nselect 1;\n\\.\n",
    "\\copy widgets from stdin\nselect 1;\n\\.\n",
  ])("preserves scripts with COPY data", async (sql) => {
    expect(await format(sql)).toBe(sql);
  });

  it("preserves the script when embedded formatting is disabled", async () => {
    const sql = "\\set ready true\nselect  1;\n";
    expect(await format(sql, { embeddedLanguageFormatting: "off" })).toBe(sql);
  });

  it("is stable when formatting twice", async () => {
    const once = await format(
      "\\set ready true\n\nselect a,b from widgets\n\\gset\n",
    );
    expect(await format(once)).toBe(once);
  });
});
