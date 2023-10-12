import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("call", () => {
  it(`formats CALL statement`, async () => {
    testBigquery(dedent`
      CALL proc_name(arg1, arg2, arg3)
    `);
  });
});
