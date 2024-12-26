import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("roles", () => {
  describe("CREATE ROLE", () => {
    it("formats basic CREATE ROLE", async () => {
      await testPostgresql(dedent`
        CREATE ROLE john
      `);
    });

    it("formats WITH options", async () => {
      await testPostgresql(dedent`
        CREATE ROLE john WITH SUPERUSER INHERIT LOGIN
      `);
    });

    it("formats options (without WITH)", async () => {
      await testPostgresql(dedent`
        CREATE ROLE john SUPERUSER INHERIT LOGIN
      `);
    });

    it("formats long list of options", async () => {
      await testPostgresql(dedent`
        CREATE ROLE john WITH
          SUPERUSER
          INHERIT
          LOGIN
          CREATEDB
          CONNECTION LIMIT 15
          ENCRYPTED PASSWORD 'mypass'
          VALID UNTIL '2021-01-01'
          IN ROLE role1, role2
          ROLE role3, role4
          ADMIN role5, role6
          SYSID 123
      `);
    });

    it("formats shorter list of options to multiple lines when preferred", async () => {
      await testPostgresql(dedent`
        CREATE ROLE john WITH
          SUPERUSER
          INHERIT
          LOGIN
      `);
    });
  });

  describe("DROP ROLE", () => {
    it("formats basic DROP ROLE", async () => {
      await testPostgresql("DROP ROLE john");
    });

    it("formats DROP ROLE IF EXISTS", async () => {
      await testPostgresql("DROP ROLE IF EXISTS john");
    });

    it("formats DROP ROLE with multiple roles", async () => {
      await testPostgresql("DROP ROLE role1, role2");
    });
  });
});
