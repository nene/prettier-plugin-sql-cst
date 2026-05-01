import dedent from "dedent-js";
import { testPlpgsql } from "../test_utils";

describe("assignment", () => {
  it(`formats := assignment`, async () => {
    await testPlpgsql(dedent`
      x := 42 + 8
    `);
  });

  it(`formats = assignment`, async () => {
    await testPlpgsql(dedent`
      my_var = 'hello'
    `);
  });

  it(`formats assignment to array index`, async () => {
    await testPlpgsql(dedent`
      my_arr[8] = 123
    `);
  });
});
