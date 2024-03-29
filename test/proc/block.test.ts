import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("block statement", () => {
  it(`formats BEGIN .. END`, async () => {
    await testBigquery(dedent`
      BEGIN
        SELECT 1;
        SELECT 2;
        SELECT 3;
      END
    `);
  });

  it(`formats BEGIN .. EXCEPTION .. END`, async () => {
    await testBigquery(dedent`
      BEGIN
        SELECT 1;
      EXCEPTION WHEN ERROR THEN
        SELECT @@error.message;
      END
    `);
  });
});
