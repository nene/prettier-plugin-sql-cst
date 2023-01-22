import dedent from "dedent-js";
import { test } from "./test_utils";

describe("delete", () => {
  it(`formats DELETE statement`, () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
    `);
  });
});
