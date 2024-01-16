import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("with sqlCanonicalSyntax enabled", () => {
  it(`converts implicit aliases to use AS keyword`, async () => {
    expect(
      await pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`, {
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      SELECT 1 AS foo, 2 AS bar
      FROM
        client AS c,
        tbl AS t
    `);
  });

  it(`replaces TEMP with TEMPORARY`, async () => {
    expect(
      await pretty(`CREATE TEMP TABLE foo (id INT)`, {
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
        CREATE TEMPORARY TABLE foo (
          id INT
        )
      `);
  });

  it(`converts old PostgreSQL := syntax to standard => syntax for named arguments`, async () => {
    expect(
      await pretty(`SELECT my_func(foo := 'Hello', bar := 'World')`, {
        dialect: "postgresql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(`SELECT my_func(foo => 'Hello', bar => 'World')`);
  });
});
