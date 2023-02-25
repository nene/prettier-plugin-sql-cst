import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("capacity", () => {
  describe("create capacity", () => {
    it(`formats CREATE CAPACITY`, () => {
      testBigquery(dedent`
        CREATE CAPACITY commitment_id
        OPTIONS(slot_count = 100, plan = 'FLEX')
      `);
    });
  });

  describe("drop capacity", () => {
    it(`formats DROP CAPACITY`, () => {
      testBigquery(`DROP CAPACITY commitment_id`);
    });

    it(`formats IF EXISTS`, () => {
      testBigquery(`DROP CAPACITY IF EXISTS commitment_id`);
    });
  });
});
