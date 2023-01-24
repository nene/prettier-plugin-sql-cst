import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlAliasAs option", () => {
  it(`sqlAliasAs: "preserve" keeps aliases as-is`, () => {
    expect(
      pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`, {
        sqlAliasAs: "preserve",
      })
    ).toBe(dedent`
      SELECT 1 AS foo, 2 bar
      FROM
        client c,
        tbl AS t
    `);
  });

  it(`sqlAliasAs: "always" converts keywords to uppercase`, () => {
    expect(
      pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`, {
        sqlAliasAs: "always",
      })
    ).toBe(dedent`
      SELECT 1 AS foo, 2 AS bar
      FROM
        client AS c,
        tbl AS t
    `);
  });

  it(`sqlAliasAs: "never" converts keywords to lowercase`, () => {
    expect(
      pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`, {
        sqlAliasAs: "never",
      })
    ).toBe(dedent`
      SELECT 1 foo, 2 bar
      FROM
        client c,
        tbl t
    `);
  });
});
