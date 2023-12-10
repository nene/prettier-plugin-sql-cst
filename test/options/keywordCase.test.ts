import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlKeywordCase option", () => {
  it(`defaults to uppercasing of all keywords`, async () => {
    expect(await pretty(`select * From tbl WHERE x > 0`)).toBe(dedent`
      SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "preserve" keeps keywords case as-is`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "preserve",
      })
    ).toBe(dedent`
      select * From tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "upper" converts keywords to uppercase`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "upper",
      })
    ).toBe(dedent`
      SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`sqlKeywordCase: "lower" converts keywords to lowercase`, async () => {
    expect(
      await pretty(`select * From tbl WHERE x > 0`, {
        sqlKeywordCase: "lower",
      })
    ).toBe(dedent`
      select * from tbl where x > 0
    `);
  });
});
