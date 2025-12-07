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

  it(`applies to TIME data type`, async () => {
    expect(
      await pretty(`CREATE TABLE t (x TIMESTAMP WITH TIME ZONE)`, {
        sqlTypeCase: "lower",
        dialect: "postgresql",
      }),
    ).toBe(dedent`
      CREATE TABLE t (x timestamp with time zone)
    `);
  });

  it(`applies to INTERVAL data type`, async () => {
    expect(
      await pretty(`CREATE TABLE t (x INTERVAL DAY TO MINUTE)`, {
        sqlTypeCase: "lower",
        dialect: "postgresql",
      }),
    ).toBe(dedent`
      CREATE TABLE t (x interval day to minute)
    `);
  });

  it(`applies to STRUCT<> and ARRAY<> data types`, async () => {
    expect(
      await pretty(`CREATE TABLE t (x STRUCT<a ARRAY<STRING>>)`, {
        sqlTypeCase: "lower",
        dialect: "bigquery",
      }),
    ).toBe(dedent`
      CREATE TABLE t (x struct<a array<string>>)
    `);
  });

  it(`does not apply to SETOF data types`, async () => {
    expect(
      await pretty(`CREATE TABLE t (x SETOF INT)`, {
        sqlTypeCase: "lower",
        dialect: "postgresql",
      }),
    ).toBe(dedent`
      CREATE TABLE t (x SETOF int)
    `);
  });

  it(`does not apply to TABLE data type`, async () => {
    expect(
      await pretty(`CREATE FUNCTION foo() RETURNS TABLE (id INT) AS ''`, {
        sqlTypeCase: "lower",
        dialect: "postgresql",
      }),
    ).toBe(dedent`
      CREATE FUNCTION foo()
      RETURNS TABLE (id int)
      AS ''
    `);
  });
});
