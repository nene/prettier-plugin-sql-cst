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

  it(`formats JSON literals`, () => {
    test(
      dedent`
        SELECT JSON '{"foo": true}'
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats INTERVAL literals`, () => {
    test(
      dedent`
        SELECT
          INTERVAL 5 DAY,
          INTERVAL 90 MINUTE,
          INTERVAL '10:20:30.52' HOUR TO SECOND,
          INTERVAL '1 5:30' DAY TO MINUTE
      `,
      { dialect: "bigquery" }
    );
  });
});
