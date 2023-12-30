import dedent from "dedent-js";
import { test, testMariadb, testPostgresql } from "../test_utils";

describe("select .. limiting", () => {
  it(`formats LIMIT with just count`, async () => {
    await test(`SELECT * FROM tbl LIMIT 10`);
  });

  it(`formats LIMIT ALL`, async () => {
    await testPostgresql(`SELECT * FROM tbl LIMIT ALL`);
  });

  it(`formats LIMIT ... ROWS EXAMINED`, async () => {
    await testMariadb(
      dedent`
        SELECT *
        FROM tbl
        LIMIT
          25, 100
          ROWS EXAMINED 1000
      `,
      { printWidth: 20 },
    );
  });
});
