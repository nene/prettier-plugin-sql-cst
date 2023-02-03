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
});
