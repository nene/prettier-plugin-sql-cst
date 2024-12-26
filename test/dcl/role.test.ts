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

  describe("ALTER ROLE", () => {
    it("formats ALTER ROLE .. options", async () => {
      await testPostgresql(
        "ALTER ROLE john LOGIN CREATEDB CONNECTION LIMIT 15",
      );
    });

    it("formats ALTER ROLE .. WITH options", async () => {
      await testPostgresql(
        "ALTER ROLE john WITH LOGIN CREATEDB CONNECTION LIMIT 15",
      );
    });

    it("formats ALTER ROLE on multiple lines if user prefers", async () => {
      await testPostgresql(dedent`
        ALTER ROLE john
        WITH LOGIN CREATEDB CONNECTION LIMIT 15
      `);
    });

    it("formats long list of WITH options to multiple lines", async () => {
      await testPostgresql(dedent`
        ALTER ROLE john
        WITH
          LOGIN
          CREATEDB
          ADMIN role1, role2
          CONNECTION LIMIT 15
          ENCRYPTED PASSWORD 'mypass'
      `);
    });

    it("formats long list of options to multiple lines", async () => {
      await testPostgresql(dedent`
        ALTER ROLE john
          LOGIN
          CREATEDB
          ADMIN role1, role2
          CONNECTION LIMIT 15
          ENCRYPTED PASSWORD 'mypass'
      `);
    });

    it("formats ALTER ROLE .. RENAME TO", async () => {
      await testPostgresql("ALTER ROLE john RENAME TO johnny");
    });

    it("formats ALTER ROLE .. SET option TO value", async () => {
      await testPostgresql("ALTER ROLE john SET search_path TO myschema");
      await testPostgresql("ALTER ROLE john SET search_path = DEFAULT");
      await testPostgresql("ALTER ROLE john SET search_path = DEFAULT");
    });

    it("formats ALTER ROLE .. RESET option", async () => {
      await testPostgresql("ALTER ROLE john RESET search_path");
      await testPostgresql("ALTER ROLE john RESET ALL");
    });

    it("formats ALTER ROLE .. IN DATABASE db {RESET | SET}", async () => {
      await testPostgresql(
        "ALTER ROLE john IN DATABASE my_db SET search_path TO myschema",
      );
      await testPostgresql("ALTER ROLE john IN DATABASE my_db RESET ALL");
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

  describe("SET ROLE", () => {
    it("formats SET ROLE", async () => {
      await testPostgresql("SET ROLE moderator");
      await testPostgresql("SET SESSION ROLE moderator");
      await testPostgresql("SET LOCAL ROLE NONE");
    });

    it("formats RESET ROLE", async () => {
      await testPostgresql("RESET ROLE");
    });
  });
});
