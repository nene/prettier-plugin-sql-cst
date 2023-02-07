import { test } from "./test_utils";

describe("truncate", () => {
  it(`formats TRUNCATE TABLE statement`, () => {
    test(`TRUNCATE TABLE dataset.employee`, { dialect: "bigquery" });
  });
});
