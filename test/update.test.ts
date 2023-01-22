import dedent from "dedent-js";
import { test } from "./test_utils";

describe("update", () => {
  it(`formats UPDATE statement`, () => {
    test(dedent`
      UPDATE employee
      SET salary = 1000
    `);
  });
});
