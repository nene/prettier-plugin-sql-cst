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

  it(`formats OFFSET clause`, async () => {
    await testPostgresql(`SELECT * FROM tbl OFFSET 1000`);
  });

  it(`formats OFFSET and FETCH clauses`, async () => {
    await testPostgresql(
      dedent`
        SELECT *
        FROM tbl
        OFFSET 1000 ROWS
        FETCH FIRST 100 ROWS ONLY
      `,
    );
  });

  it(`formats single-line OFFSET and FETCH clauses`, async () => {
    await testPostgresql(
      dedent`
        SELECT *
        FROM tbl
        OFFSET 1 ROW
        FETCH NEXT ROW WITH TIES
      `,
    );
  });

  // While OFFSET clause supports expressions,
  // FETCH only supports number literals
  it(`formats OFFSET with long expressions`, async () => {
    await testPostgresql(
      dedent`
        SELECT *
        FROM tbl
        OFFSET
          (20500 + 5200 / 82) ROWS
      `,
      { printWidth: 30 },
    );
  });
});
