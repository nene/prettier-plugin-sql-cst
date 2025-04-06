import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlLiteralCase option", () => {
  it(`defaults to uppercasing of all literals`, async () => {
    expect(await pretty(`SELECT true, false, null`)).toBe(dedent`
      SELECT TRUE, FALSE, NULL
    `);
  });

  it(`sqlKeywordCase: "preserve" keeps keywords case as-is`, async () => {
    expect(
      await pretty(`SELECT true, False, NULL`, {
        sqlLiteralCase: "preserve",
      }),
    ).toBe(dedent`
      SELECT true, False, NULL
    `);
  });

  it(`sqlLiteralCase: "upper" converts keywords to uppercase`, async () => {
    expect(
      await pretty(`SELECT true, False, NULL`, {
        sqlLiteralCase: "upper",
      }),
    ).toBe(dedent`
      SELECT TRUE, FALSE, NULL
    `);
  });

  it(`sqlLiteralCase: "lower" converts keywords to lowercase`, async () => {
    expect(
      await pretty(`SELECT true, False, NULL`, {
        sqlLiteralCase: "lower",
      }),
    ).toBe(dedent`
      SELECT true, false, null
    `);
  });
});
