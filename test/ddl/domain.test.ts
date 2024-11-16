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
