import dedent from "dedent-js";
import { test, testBigquery, testMysql } from "../test_utils";

describe("delete", () => {
  it(`formats DELETE statement`, async () => {
    await test(dedent`
      DELETE FROM employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE without FROM`, async () => {
    await testBigquery(dedent`
      DELETE employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE with MySQL hints`, async () => {
    await testMysql(dedent`
      DELETE QUICK IGNORE FROM employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE statement with RETURNING clause`, async () => {
    await test(dedent`
      DELETE FROM employee
      WHERE id = 10
      RETURNING
        id AS employee_identifier,
        name AS employee_name,
        status AS employee_status
    `);
  });

  it(`formats DELETE statement with ORDER BY and LIMIT`, async () => {
    await test(dedent`
      DELETE FROM employee
      WHERE id = 10
      ORDER BY name
      LIMIT 100
    `);
  });
});
