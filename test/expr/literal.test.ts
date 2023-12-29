import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("literal", () => {
  it(`formats BigQuery NUMERIC and BIGNUMERIC literals`, async () => {
    await testBigquery(`SELECT NUMERIC '12345', BIGNUMERIC '1.23456e05'`);
  });

  it(`formats DATE/TIME literals`, async () => {
    await testBigquery(
      dedent`
        SELECT
          DATE '2014-09-27',
          TIME '12:30:00.45',
          DATETIME '2014-09-27 12:30:00.45',
          TIMESTAMP '2014-09-27 12:30:00.45-08'
      `,
    );
  });

  it(`formats INTERVAL literals`, async () => {
    await testBigquery(
      dedent`
        SELECT
          INTERVAL 5 DAY,
          INTERVAL -90 MINUTE,
          INTERVAL '10:20:30.52' HOUR TO SECOND,
          INTERVAL '1 5:30' DAY TO MINUTE
      `,
    );
  });

  describe("array literals", () => {
    it(`formats array literals`, async () => {
      await testBigquery(
        dedent`
          SELECT
            [1, 2, 3],
            ['x', 'y', 'xyz'],
            ARRAY[1, 2, 3],
            ARRAY<STRING>['x', 'y', 'xyz']
        `,
      );
    });

    it(`formats long array literal to multiple lines`, async () => {
      await testBigquery(
        dedent`
          SELECT
            [
              'a somewhat large array',
              'containing some strings',
              'which themselves',
              'are somewhat long.'
            ]
        `,
      );
    });
  });

  describe("struct literals", () => {
    it(`formats struct literals`, async () => {
      await testBigquery(
        dedent`
          SELECT
            (1, 2, 3),
            (1, 'abc'),
            STRUCT(1 AS foo, 'abc' AS bar),
            STRUCT<INT64, FLOAT64>(128, 1.5),
            STRUCT<x INT, y INT>(1, 2)
        `,
      );
    });

    it(`formats long struct literal to multiple lines`, async () => {
      await testBigquery(
        dedent`
          SELECT
            STRUCT(
              22541 AS id,
              'Sherlock Holmes' AS name,
              'Baker Street' AS address,
              'Private detective' AS occupation
            )
        `,
      );
    });
  });
});
