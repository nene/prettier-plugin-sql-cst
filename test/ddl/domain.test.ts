import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("domain", () => {
  describe("create domain", () => {
    it(`formats CREATE DOMAIN on a single line`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain INT
      `);
    });

    it(`formats CREATE DOMAIN with AS on a single line`, async () => {
      await testPostgresql(dedent`
        CREATE DOMAIN my_domain AS VARCHAR(255)
      `);
    });
  });
});
