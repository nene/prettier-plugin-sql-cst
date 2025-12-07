import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlIdentifierCase option", () => {
  it(`defaults to preserving the case of unquoted identifiers`, async () => {
    expect(await pretty(`SELECT foo, BAR, Baz, ZapZopZup`)).toBe(dedent`
      SELECT foo, BAR, Baz, ZapZopZup
    `);
  });

  it(`sqlIdentifierCase: "preserve" keeps identifier case as-is`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "preserve",
      }),
    ).toBe(dedent`
      SELECT foo, BAR, Baz, ZapZopZup
    `);
  });

  it(`sqlIdentifierCase: "upper" converts identifiers to uppercase`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT FOO, BAR, BAZ, ZAPZOPZUP
    `);
  });

  it(`sqlIdentifierCase: "lower" converts identifiers to lowercase`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "lower",
      }),
    ).toBe(dedent`
      SELECT foo, bar, baz, zapzopzup
    `);
  });

  it(`does not change the case of quoted identifiers`, async () => {
    expect(
      await pretty(`SELECT "foo", foo, \`foo\`, [foo]`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT "foo", FOO, \`foo\`, [foo]
    `);
  });

  it(`changes case of function names`, async () => {
    expect(
      await pretty(`SELECT count(*), avg(age) FROM people`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT COUNT(*), AVG(AGE) FROM PEOPLE
    `);
  });
});
