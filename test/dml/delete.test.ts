import dedent from "dedent-js";
import { test, testBigquery } from "../test_utils";

describe("delete", () => {
  it(`formats DELETE statement`, async () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE without FROM`, async () => {
    testBigquery(dedent`
      DELETE employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE statement with RETURNING clause`, async () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
      RETURNING
        id AS employee_identifier,
        name AS employee_name,
        status AS employee_status
    `);
  });

  it(`formats DELETE statement with ORDER BY and LIMIT`, async () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
      ORDER BY name
      LIMIT 100
    `);
  });
});
