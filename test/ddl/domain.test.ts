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
});
