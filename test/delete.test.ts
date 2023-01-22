import dedent from "dedent-js";
import { test } from "./test_utils";

describe("delete", () => {
  it(`formats DELETE statement`, () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE statement with RETURNING clause`, () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
      RETURNING
        id AS employee_identifier,
        name AS employee_name,
        status AS employee_status
    `);
  });
});
