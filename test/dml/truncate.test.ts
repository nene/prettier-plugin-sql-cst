import dedent from "dedent-js";
import { testBigquery, testPostgresql } from "../test_utils";

describe("truncate", () => {
  it(`formats TRUNCATE TABLE statement`, async () => {
    await testBigquery(`TRUNCATE TABLE dataset.employee`);
  });

  it(`formats {CASCADE | RESTRICT}`, async () => {
    await testPostgresql(`TRUNCATE TABLE dataset.employee CASCADE`);
  });

  it(`formats {RESTART | CONTINUE} IDENTITY`, async () => {
    await testPostgresql(`TRUNCATE TABLE dataset.employee RESTART IDENTITY`);
  });

  it(`formats multi-table truncate with modifiers`, async () => {
    await testPostgresql(dedent`
      TRUNCATE TABLE
        dataset.employee,
        dataset.manager,
        dataset.department,
        dataset.company
        CONTINUE IDENTITY
        RESTRICT
    `);
  });
});
