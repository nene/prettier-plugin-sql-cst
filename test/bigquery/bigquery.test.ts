import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("bigquery", () => {
  ["CAPACITY", "RESERVATION", "ASSIGNMENT"].forEach((entityType) => {
    it(`formats CREATE ${entityType}`, async () => {
      await testBigquery(dedent`
        CREATE ${entityType} commitment_id
        OPTIONS (slot_count = 100, plan = 'FLEX')
      `);
    });

    it(`formats DROP ${entityType}`, async () => {
      await testBigquery(`DROP ${entityType} commitment_id`);
    });

    it(`formats DROP ${entityType} IF EXISTS`, async () => {
      await testBigquery(`DROP ${entityType} IF EXISTS commitment_id`);
    });
  });

  it(`formats ALTER ORGANIZATION`, async () => {
    await testBigquery(dedent`
      ALTER ORGANIZATION
      SET OPTIONS (default_time_zone = 'America/Los_Angeles')
    `);
  });

  ["PROJECT", "BI_CAPACITY", "CAPACITY", "RESERVATION"].forEach(
    (entityType) => {
      it(`formats ALTER ${entityType}`, async () => {
        await testBigquery(dedent`
        ALTER ${entityType} some_name
        SET OPTIONS (default_time_zone = 'America/Los_Angeles')
      `);
      });
    },
  );

  describe("assert", () => {
    it(`formats ASSERT`, async () => {
      await testBigquery(dedent`
        ASSERT x > 10
      `);
    });

    it(`formats ASSERT with message`, async () => {
      await testBigquery(dedent`
        ASSERT x > 10 AS 'x must be greater than 10'
      `);
    });
  });
});
