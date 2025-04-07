import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlTypeCase option", () => {
  it(`defaults to uppercasing of all types`, async () => {
    expect(await pretty(`CREATE TABLE t (id int, age Character Varying (100))`))
      .toBe(dedent`
      CREATE TABLE t (id INT, age CHARACTER VARYING (100))
    `);
  });

  it(`sqlTypeCase: "preserve" keeps type names case as-is`, async () => {
    expect(
      await pretty(`CREATE TABLE t (id int, age Character Varying (100))`, {
        sqlTypeCase: "preserve",
      }),
    ).toBe(dedent`
      CREATE TABLE t (id int, age Character Varying (100))
    `);
  });

  it(`sqlTypeCase: "upper" converts type names to uppercase`, async () => {
    expect(
      await pretty(`CREATE TABLE t (id int, age Character Varying (100))`, {
        sqlTypeCase: "upper",
      }),
    ).toBe(dedent`
      CREATE TABLE t (id INT, age CHARACTER VARYING (100))
    `);
  });

  it(`sqlTypeCase: "lower" converts type names to lowercase`, async () => {
    expect(
      await pretty(`CREATE TABLE t (id INT, age character Varying (100))`, {
        sqlTypeCase: "lower",
      }),
    ).toBe(dedent`
      CREATE TABLE t (id int, age character varying (100))
    `);
  });
});
