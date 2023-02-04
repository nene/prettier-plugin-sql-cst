import dedent from "dedent-js";
import { test } from "./test_utils";

describe("literal", () => {
  it(`formats BigQuery NUMERIC and BIGNUMERIC literals`, () => {
    test(`SELECT NUMERIC '12345', BIGNUMERIC '1.23456e05'`, {
      dialect: "bigquery",
    });
  });

  it(`formats DATE/TIME literals`, () => {
    test(
      dedent`
        SELECT
          DATE '2014-09-27',
          TIME '12:30:00.45',
          DATETIME '2014-09-27 12:30:00.45',
          TIMESTAMP '2014-09-27 12:30:00.45-08'
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats INTERVAL literals`, () => {
    test(
      dedent`
        SELECT
          INTERVAL 5 DAY,
          INTERVAL -90 MINUTE,
          INTERVAL '10:20:30.52' HOUR TO SECOND,
          INTERVAL '1 5:30' DAY TO MINUTE
      `,
      { dialect: "bigquery" }
    );
  });

  describe("array literals", () => {
    it(`formats array literals`, () => {
      test(
        dedent`
          SELECT
            [1, 2, 3],
            ['x', 'y', 'xyz'],
            ARRAY[1, 2, 3],
            ARRAY<STRING>['x', 'y', 'xyz']
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long array literal to multiple lines`, () => {
      test(
        dedent`
          SELECT
            [
              'a somewhat large array',
              'containing some strings',
              'which themselves',
              'are somewhat long.'
            ]
        `,
        { dialect: "bigquery" }
      );
    });
  });

  describe("struct literals", () => {
    it(`formats struct literals`, () => {
      test(
        dedent`
          SELECT
            (1, 2, 3),
            (1, 'abc'),
            STRUCT(1 AS foo, 'abc' AS bar),
            STRUCT<INT64, FLOAT64>(128, 1.5),
            STRUCT<x INT, y INT>(1, 2)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long struct literal to multiple lines`, () => {
      test(
        dedent`
          SELECT
            STRUCT(
              22541 AS id,
              'Sherlock Holmes' AS name,
              'Baker Street' AS address,
              'Private detective' AS occupation
            )
        `,
        { dialect: "bigquery" }
      );
    });
  });
});
