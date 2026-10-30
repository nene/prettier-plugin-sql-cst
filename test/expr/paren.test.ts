import dedent from "dedent-js";
import { pretty, test, testBigquery, testPostgresql } from "../test_utils";

describe("expr", () => {
  it(`eliminates unnecessary (((nested))) parenthesis`, async () => {
    expect(await pretty(`SELECT (((1 + 2))) * 3`)).toBe(dedent`
      SELECT (1 + 2) * 3
    `);
  });

  it(`preserves comments when eliminating (((nested))) parenthesis`, async () => {
    expect(await pretty(`SELECT (/*c1*/(/*c2*/(/*c3*/ 1 + 2))) * 3`))
      .toBe(dedent`
      SELECT /*c1*/ /*c2*/ (/*c3*/ 1 + 2) * 3
    `);
  });

  it(`eliminates unnecessary parenthesis around function arguments`, async () => {
    expect(await pretty(`SELECT my_func((id), (name))`)).toBe(dedent`
      SELECT my_func(id, name)
    `);
  });

  it(`preserves comments when eliminating func(((arg))) parenthesis`, async () => {
    expect(await pretty(`SELECT count(/*c1*/(/*c2*/ id))`)).toBe(dedent`
      SELECT count(/*c1*/ /*c2*/ id)
    `);
  });

  it(`preserves parenthesis around SELECT inside function arguments`, async () => {
    await test(dedent`
      SELECT coalesce((SELECT foo FROM bar), 'default') FROM tbl
    `);
  });

  it(`preserves parenthesis around compound-SELECT inside function arguments`, async () => {
    await test(dedent`
      SELECT coalesce(
        '',
        (
          SELECT x FROM xs
          UNION
          SELECT y FROM ys
        )
      )
      FROM tbl
    `);
  });

  // Issue #73
  it(`preserves parenthesis around DISTINCT inside function arguments`, async () => {
    await test(dedent`
      SELECT count(DISTINCT (foo, bar))
      FROM tbl
    `);
  });

  it(`preserves parenthesis around PostgreSQL row constructors`, async () => {
    await testPostgresql(dedent`
      SELECT my_func((1, 2))
    `);
  });
  it(`preserves parenthesis around BigQuery structs`, async () => {
    await testBigquery(dedent`
      SELECT my_func((1, 2))
    `);
  });
});
