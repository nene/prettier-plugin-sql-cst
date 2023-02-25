import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("raise", () => {
  it(`formats RAISE statement`, () => {
    testBigquery(dedent`
      RAISE
    `);
  });

  it(`formats RAISE with message`, () => {
    testBigquery(dedent`
      RAISE USING MESSAGE = 'Serious error!'
    `);
  });
});
