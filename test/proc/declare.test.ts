import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("declare", () => {
  it(`formats basic DECLARE statement`, async () => {
    testBigquery(dedent`
      DECLARE x
    `);
  });

  it(`formats DECLARE with type`, async () => {
    testBigquery(dedent`
      DECLARE x INT64
    `);
  });

  it(`formats declaring of multiple variables`, async () => {
    testBigquery(dedent`
      DECLARE foo, bar, baz INT64
    `);
  });

  it(`formats DEFAULT`, async () => {
    testBigquery(dedent`
      DECLARE d DATE DEFAULT CURRENT_DATE()
    `);
  });
});
