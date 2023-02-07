import dedent from "dedent-js";
import { test } from "./test_utils";

describe("delete", () => {
  it(`formats DELETE statement`, () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
    `);
  });

  it(`formats DELETE without FROM`, () => {
    test(
      dedent`
        DELETE employee
        WHERE id = 10
      `,
      { dialect: "bigquery" }
    );
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

  it(`formats DELETE statement with ORDER BY and LIMIT`, () => {
    test(dedent`
      DELETE FROM employee
      WHERE id = 10
      ORDER BY name
      LIMIT 100
    `);
  });
});
