import dedent from "dedent-js";
import { test } from "../test_utils";

describe("create virtual table", () => {
  it(`formats CREATE VIRTUAL TABLE`, () => {
    test(dedent`
      CREATE VIRTUAL TABLE my_table
      USING my_func(1, 2)
    `);
  });

  it(`formats IF NOT EXISTS`, () => {
    test(dedent`
      CREATE VIRTUAL TABLE IF NOT EXISTS my_table
      USING my_func(1, 2)
    `);
  });
});
