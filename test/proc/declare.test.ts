import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("declare", () => {
  it(`formats basic DECLARE statement`, async () => {
    await testBigquery(dedent`
      DECLARE x
    `);
  });

  it(`formats DECLARE with type`, async () => {
    await testBigquery(dedent`
      DECLARE x INT64
    `);
  });

  it(`formats declaring of multiple variables`, async () => {
    await testBigquery(dedent`
      DECLARE foo, bar, baz INT64
    `);
  });

  it(`formats DEFAULT`, async () => {
    await testBigquery(dedent`
      DECLARE d DATE DEFAULT CURRENT_DATE()
    `);
  });
});
