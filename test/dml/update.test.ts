import dedent from "dedent-js";
import { test } from "../test_utils";

describe("update", () => {
  it(`formats UPDATE statement`, async () => {
    await test(dedent`
      UPDATE employee
      SET salary = 1000
      WHERE id = 10
    `);
  });

  it(`formats UPDATE statement with multiple assignments`, async () => {
    await test(dedent`
      UPDATE employee
      SET
        name = 'John Doe',
        salary = 1000,
        resigned = FALSE
      WHERE id = 11
    `);
  });

  it(`formats UPDATE with parenthesized column groups`, async () => {
    await test(dedent`
      UPDATE employee
      SET
        (name, salary) = ('John Doe', 1000),
        (resigned, status) = (FALSE, 'active')
    `);
  });

  it(`formats OR ABORT modifier`, async () => {
    await test(dedent`
      UPDATE OR ABORT employee
      SET salary = 1000
    `);
  });

  it(`formats UPDATE with RETURNING clause`, async () => {
    await test(dedent`
      UPDATE client
      SET status = 2
      RETURNING *
    `);
  });
});
