import dedent from "dedent-js";
import { rawPretty, rawTest } from "./test_utils";

describe("comments", () => {
  it(`formats block comments`, () => {
    rawTest(dedent`
      /* leading comment */
      SELECT 1, /*com1*/ 2 /*com2*/;
      /* trailing comment */

    `);
  });

  it(`formats basic doc-comments`, () => {
    rawTest(dedent`
      /**
       * A large doc-comment comment
       * inside this block of code
       */
      SELECT 1, 2, 3;

    `);
  });

  it(`formats block comments between syntax elements`, () => {
    rawTest(dedent`
      CREATE /*c1*/ TABLE /*c2*/ IF /*c3*/ NOT EXISTS /*c4*/ foo (
        id /*c5*/ INT /*c6*/ NOT /*c7*/ NULL
      );

    `);
  });

  it(`formats line comments`, () => {
    rawTest(dedent`
      -- first line comment
      -- second line comment
      SELECT 1; -- third line comment
      -- final comment

    `);
  });

  it(`moves line comments before comma to line ends`, () => {
    expect(
      rawPretty(`
        SELECT
          1 -- com1
          ,2 -- com2
          ,3 -- com3
      `)
    ).toBe(dedent`
      SELECT
        1, -- com1
        2, -- com2
        3; -- com3

    `);
  });

  it(`formats comments between statements`, () => {
    rawTest(dedent`
      -- comment for 1
      SELECT 1;

      -- comment for 2
      SELECT 2;
      -- comment for 3
      SELECT 3;

    `);
  });
});
