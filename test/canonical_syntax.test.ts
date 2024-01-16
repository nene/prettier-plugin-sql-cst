import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("with sqlCanonicalSyntax enabled", () => {
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
});
