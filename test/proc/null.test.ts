import dedent from "dedent-js";
import { testPlpgsql } from "../test_utils";

describe("null", () => {
  it(`formats NULL statement`, async () => {
    await testPlpgsql(dedent`
      NULL
    `);
  });
});
