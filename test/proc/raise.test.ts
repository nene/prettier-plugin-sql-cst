import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("raise", () => {
  it(`formats RAISE statement`, async () => {
    testBigquery(dedent`
      RAISE
    `);
  });

  it(`formats RAISE with message`, async () => {
    testBigquery(dedent`
      RAISE USING MESSAGE = 'Serious error!'
    `);
  });
});
