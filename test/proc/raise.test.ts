import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("raise", () => {
  it(`formats RAISE statement`, async () => {
    await testBigquery(dedent`
      RAISE
    `);
  });

  it(`formats RAISE with message`, async () => {
    await testBigquery(dedent`
      RAISE USING MESSAGE = 'Serious error!'
    `);
  });
});
