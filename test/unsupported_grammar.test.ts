import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("with sqlAcceptUnsupportedGrammar enabled", () => {
  it(`skips formatting of unknown SQL statement`, async () => {
    expect(
      await pretty(`CREATE PUZZLE foo.bar WITH SIZE 12x9`, {
        sqlAcceptUnsupportedGrammar: true,
      }),
    ).toBe(dedent`
      CREATE PUZZLE foo.bar WITH SIZE 12x9
    `);
  });

  it(`continues formatting as normal after the skipped statement`, async () => {
    expect(
      await pretty(`CREATE PUZZLE foo; select  1.5  as nr;drop puzzle`, {
        sqlAcceptUnsupportedGrammar: true,
      }),
    ).toBe(dedent`
      CREATE PUZZLE foo;
      SELECT 1.5 AS nr;
      drop puzzle
    `);
  });
});
