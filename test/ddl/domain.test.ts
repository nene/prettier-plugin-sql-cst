import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("domain", () => {
  describe("create domain", () => {
    it(`formats CREATE DOMAIN`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain INT
      `);
    });

    it(`formats CREATE DOMAIN with AS`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain AS VARCHAR(255)
      `);
    });

    it(`formats CREATE DOMAIN with constraints`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain VARCHAR(255) NOT NULL CHECK (value > 0)
      `);
    });

    it(`formats CREATE DOMAIN with constraints to multiple lines if user prefers`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain VARCHAR(255)
          NOT NULL
          CHECK (value > 0)
      `);
    });

    it(`formats CREATE DOMAIN with named constraints`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain VARCHAR(255)
          CONSTRAINT my_const1 NULL
          CONSTRAINT my_const2 CHECK (value > 0)
      `);
    });
  });

  describe("alter domain", () => {
    it(`formats ALTER DOMAIN`, async () => {
      await testPostgresql(dedent`
        ALTER DOMAIN my_domain SET DEFAULT 0
      `);
    });

    [
      "SET DEFAULT 1",
      "DROP DEFAULT",
      "SET NOT NULL",
      "DROP NOT NULL",
      "ADD CONSTRAINT zipchk CHECK (char_length(VALUE) = 5)",
      "ADD CHECK (x > 0) NOT VALID",
      "DROP CONSTRAINT zipchk",
      "DROP CONSTRAINT IF EXISTS zipchk RESTRICT",
      "RENAME CONSTRAINT zipchk TO zipcheck",
      "VALIDATE CONSTRAINT zipchk",
      "OWNER TO CURRENT_USER",
      "RENAME TO new_name",
      "SET SCHEMA myschema",
    ].forEach((action) => {
      it(`formats ALTER DOMAIN ... ${action}`, async () => {
        await testPostgresql(dedent`
          ALTER DOMAIN my_domain ${action}
        `);
      });
    });
  });

  describe("drop domain", () => {
    it(`formats DROP DOMAIN`, async () => {
      await testPostgresql(dedent`
        DROP DOMAIN my_domain
      `);
    });

    it(`formats DROP DOMAIN with multiple domain names`, async () => {
      await testPostgresql(dedent`
        DROP DOMAIN my_domain1, my_domain2, my_domain3
      `);
    });

    it(`formats DROP DOMAIN .. IF EXISTS ... CASCADE`, async () => {
      await testPostgresql(dedent`
        DROP DOMAIN IF EXISTS my_domain CASCADE
      `);
    });
  });
});
