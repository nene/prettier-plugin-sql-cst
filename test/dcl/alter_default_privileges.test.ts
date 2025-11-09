import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("alter default privileges", () => {
  it(`formats short GRANT on single line`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO john
    `);
  });

  it(`formats short REVOKE on single line`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM john
    `);
  });

  it(`format short FOR ROLE clause on single line`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES FOR ROLE admin GRANT SELECT ON TYPES TO abc
    `);
  });

  it(`formats short IN SCHEMA clause in single line`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES IN SCHEMA foo GRANT SELECT ON TYPES TO abc
    `);
  });

  it(`formats long clauses to multiple lines`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES
      FOR ROLE admin, moderator
      IN SCHEMA magic, mushroom, shower
      GRANT DELETE, TRUNCATE ON TABLES TO johnny
    `);
  });

  it(`formats long GRANT to multiple lines`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES
      GRANT DELETE, TRUNCATE, REFERENCES, MAINTAIN ON TABLES
      TO johnny WITH GRANT OPTION
    `);
  });

  it(`formats long REVOKE to multiple lines`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES
      REVOKE GRANT OPTION FOR DELETE, TRUNCATE, REFERENCES, MAINTAIN ON TABLES
      FROM johnny CASCADE
    `);
  });

  it(`formats even longer REVOKE to even more lines`, async () => {
    await testPostgresql(dedent`
      ALTER DEFAULT PRIVILEGES
      REVOKE GRANT OPTION FOR
        SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, MAINTAIN
        ON TABLES
      FROM johnny_monny, alice_malice, sigmund_freud, elvis_presley CASCADE
    `);
  });
});
