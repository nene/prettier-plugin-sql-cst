import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("bigquery", () => {
  ["CAPACITY", "RESERVATION", "ASSIGNMENT"].forEach((entityType) => {
    it(`formats CREATE ${entityType}`, () => {
      testBigquery(dedent`
        CREATE ${entityType} commitment_id
        OPTIONS(slot_count = 100, plan = 'FLEX')
      `);
    });

    it(`formats DROP ${entityType}`, () => {
      testBigquery(`DROP ${entityType} commitment_id`);
    });

    it(`formats DROP ${entityType} IF EXISTS`, () => {
      testBigquery(`DROP ${entityType} IF EXISTS commitment_id`);
    });
  });
});
