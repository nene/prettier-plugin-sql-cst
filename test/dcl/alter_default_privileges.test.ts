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
});
