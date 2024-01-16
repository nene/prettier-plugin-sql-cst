import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("aliases", () => {
  it(`formats aliases`, async () => {
    await test(
      dedent`
        SELECT
          1 AS a,
          2 AS b,
          3 AS c
      `,
      { printWidth: 20 },
    );
  });

  // Behavior when sqlCanonicalSyntax: false
  it(`preserves implicit and explicit aliases as-is`, async () => {
    expect(await pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`))
      .toBe(dedent`
        SELECT 1 AS foo, 2 bar
        FROM
          client c,
          tbl AS t
      `);
  });
});
