import dedent from "dedent-js";
import { testBigquery, testMysql } from "../test_utils";

describe("return", () => {
  it(`formats RETURN statement`, async () => {
    await testBigquery(dedent`
      RETURN
    `);
  });

  it(`formats RETURN statement with value`, async () => {
    await testMysql(dedent`
      RETURN 5 + 6
    `);
  });
});
