import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("loops", () => {
  it(`formats LOOP`, () => {
    testBigquery(dedent`
      LOOP
        SELECT 1;
      END LOOP
    `);
  });
});
