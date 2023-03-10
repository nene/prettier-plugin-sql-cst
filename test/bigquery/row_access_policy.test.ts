import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("row access policy", () => {
  describe("create row access policy", () => {
    it(`formats CREATE ROW ACCESS POLICY`, () => {
      testBigquery(dedent`
        CREATE ROW ACCESS POLICY policy_name ON my_table
        FILTER USING (x > 10)
      `);
    });

    it(`formats OR REPLACE / IF NOT EXISTS`, () => {
      testBigquery(dedent`
        CREATE OR REPLACE ROW ACCESS POLICY IF NOT EXISTS policy_name ON my_table
        FILTER USING (x > 10)
      `);
    });

    it(`formats GRANT TO`, () => {
      testBigquery(dedent`
        CREATE ROW ACCESS POLICY policy_name ON my_table
        GRANT TO ('user:alice@example.com', 'domain:example.com')
        FILTER USING (x > 10)
      `);
    });
  });

  describe("drop row access policy", () => {
    it(`formats DROP ROW ACCESS POLICY`, () => {
      testBigquery(dedent`
        DROP ROW ACCESS POLICY policy_name ON my_table
      `);
    });

    it(`formats IF EXISTS`, () => {
      testBigquery(dedent`
        DROP ROW ACCESS POLICY IF EXISTS policy_name ON my_table
      `);
    });

    it(`formats DROP ALL ROW ACCESS POLICIES`, () => {
      testBigquery(dedent`
        DROP ALL ROW ACCESS POLICIES ON my_table
      `);
    });
  });
});
