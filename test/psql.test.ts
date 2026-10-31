import * as prettier from "prettier";
import * as plugin from "../src";

const format = (sql: string, options: prettier.Options = {}) =>
  prettier.format(sql, { parser: "psql", plugins: [plugin], ...options });

describe("psql parser", () => {
  it("formats SQL while preserving standalone commands and arguments", async () => {
    const sql = String.raw`\set ON_ERROR_STOP on
\restrict abc123
\if :ready
select id,name from widgets where active=true
\gset widget_
\else
  \echo 'Not ready' :name
  \quit
\endif
\unrestrict abc123
`;

    const expected = String.raw`\set ON_ERROR_STOP on
\restrict abc123
\if :ready
SELECT id, name FROM widgets WHERE active = TRUE
\gset widget_
\else
  \echo 'Not ready' :name
  \quit
\endif
\unrestrict abc123
`;

    expect(await format(sql)).toBe(expected);
    expect(await format(expected)).toBe(expected);
  });

  it("preserves query terminators without adding semicolons", async () => {
    expect(await format("select 1 as result\n\\gset result_\n")).toBe(
      "SELECT 1 AS result\n\\gset result_\n",
    );
  });

  it("formats semicolon-terminated queries without changing boundaries", async () => {
    expect(await format("select 1;\n\\echo done\nselect 2\n")).toBe(
      "SELECT 1;\n\\echo done\nSELECT 2\n",
    );
  });

  it("preserves psql variable references", async () => {
    expect(
      await format("select :value, :'name', :\"table\", :{?ready}\n"),
    ).toBe("SELECT :value, :'name', :\"table\", :{?ready}\n");
  });

  it("preserves command indentation and blank lines", async () => {
    expect(await format("select 1\n\n  \\gset\n\n  \\echo done\n")).toBe(
      "SELECT 1\n\n  \\gset\n\n  \\echo done\n",
    );
  });

  it("preserves SQL comments before query commands", async () => {
    expect(await format("select 1 -- keep this\n\\gset\n")).toBe(
      "SELECT 1 -- keep this\n\\gset\n",
    );
  });
});
