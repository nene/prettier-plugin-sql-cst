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
});
