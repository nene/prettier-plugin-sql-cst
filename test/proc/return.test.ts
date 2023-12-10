import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("return", () => {
  it(`formats RETURN statement`, async () => {
    await testBigquery(dedent`
      RETURN
    `);
  });
});
