import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("aliases", () => {
  it(`formats aliases`, () => {
    test(
      dedent`
        SELECT
          1 AS a,
          2 AS b,
          3 AS c
      `,
      { printWidth: 20 }
    );
  });

  it(`converts implicit aliases to use AS keyword`, () => {
    expect(pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`))
      .toBe(dedent`
        SELECT 1 AS foo, 2 AS bar
        FROM
          client AS c,
          tbl AS t
      `);
  });
});
