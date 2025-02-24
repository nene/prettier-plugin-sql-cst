import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("policy", () => {
  describe("create policy", () => {
    it(`formats minimal CREATE POLICY`, async () => {
      await testPostgresql(dedent`
        CREATE POLICY be_kind_policy ON permissions
      `);
    });

    it(`formats single-line short CREATE POLICY`, async () => {
      await testPostgresql(dedent`
        CREATE POLICY be_kind_policy ON permissions AS PERMISSIVE FOR SELECT
      `);
    });

    it(`formats multi-line short CREATE POLICY (if user prefers)`, async () => {
      await testPostgresql(dedent`
        CREATE POLICY be_kind_policy ON permissions
        AS PERMISSIVE
        FOR SELECT
      `);
    });

    it(`formats CREATE POLICY with all possible clauses`, async () => {
      await testPostgresql(dedent`
        CREATE POLICY be_kind_policy ON permissions
        AS RESTRICTIVE
        FOR SELECT
        TO johnny, sally
        USING (kind = 'public')
        WITH CHECK (kind = 'public')
      `);
    });
  });

  describe("alter policy", () => {
    it(`formats ALTER POLICY .. RENAME`, async () => {
      await testPostgresql(dedent`
        ALTER POLICY be_kind ON users RENAME TO be_evil
      `);
    });

    it(`formats ALTER POLICY .. altering of various clauses`, async () => {
      await testPostgresql(dedent`
        ALTER POLICY be_kind ON users
        TO johnny, sally
        USING (kind = 'public')
        WITH CHECK (kind = 'public')
      `);
    });
  });

  describe("drop policy", () => {
    it(`formats basic DROP POLICY`, async () => {
      await testPostgresql(dedent`
        DROP POLICY be_kind ON admin
      `);
    });

    it(`formats IF EXISTS and CASCADE/RESTRICT`, async () => {
      await testPostgresql(dedent`
        DROP POLICY IF EXISTS be_kind ON admin CASCADE
      `);
    });
  });
});
