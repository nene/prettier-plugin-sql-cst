import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("case", () => {
  it(`formats procedural CASE`, async () => {
    testBigquery(dedent`
      CASE foo
        WHEN 1 THEN
          SELECT CONCAT('Product one');
        ELSE
          SELECT CONCAT('Invalid product');
      END CASE
    `);
  });
});
