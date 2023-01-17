import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("keywordCase option", () => {
  it(`keywordCase: "preserve" keeps keywords case as-is`, () => {
    expect(
      pretty(`select * From tbl WHERE x > 0`, {
        keywordCase: "preserve",
      })
    ).toBe(dedent`
      select * From tbl WHERE x > 0
    `);
  });

  it(`keywordCase: "upper" converts keywords to uppercase`, () => {
    expect(
      pretty(`select * From tbl WHERE x > 0`, {
        keywordCase: "upper",
      })
    ).toBe(dedent`
      SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`keywordCase: "lower" converts keywords to lowercase`, () => {
    expect(
      pretty(`select * From tbl WHERE x > 0`, {
        keywordCase: "lower",
      })
    ).toBe(dedent`
      select * from tbl where x > 0
    `);
  });
});
