import { test, testPostgresql } from "../test_utils";

describe("select .. limiting", () => {
  it(`formats LIMIT with just count`, async () => {
    await test(`SELECT * FROM tbl LIMIT 10`);
  });

  it(`formats LIMIT ALL`, async () => {
    await testPostgresql(`SELECT * FROM tbl LIMIT ALL`);
  });
});
