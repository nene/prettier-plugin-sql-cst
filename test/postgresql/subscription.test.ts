import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("subscriptions", () => {
  describe("CREATE SUBSCRIPTION", () => {
    it(`formats CREATE SUBSCRIPTION to single line if fits`, async () => {
      await testPostgresql(dedent`
        CREATE SUBSCRIPTION my_sub CONNECTION 'con' PUBLICATION my_pub
      `);
    });

    it(`formats CREATE SUBSCRIPTION to multiple lines`, async () => {
      await testPostgresql(dedent`
        CREATE SUBSCRIPTION my_subscription
        CONNECTION 'host=192.168.1.50 port=5432 user=foo dbname=foodb'
        PUBLICATION my_publication
      `);
    });

    it(`formats CREATE SUBSCRIPTION to multiple lines`, async () => {
      await testPostgresql(dedent`
        CREATE SUBSCRIPTION my_subscription
        CONNECTION 'host=192.168.1.50 port=5432 user=foo dbname=foodb'
        PUBLICATION my_publication
      `);
    });

    it(`formats WITH clause`, async () => {
      await testPostgresql(dedent`
        CREATE SUBSCRIPTION my_subscription
        CONNECTION 'host=192.168.1.50 port=5432 user=foo dbname=foodb'
        PUBLICATION my_publication
        WITH (param1 = 1, param2 = 2)
      `);
    });
  });

  describe("DROP SUBSCRIPTION", () => {
    it(`formats DROP SUBSCRIPTION`, async () => {
      await testPostgresql(dedent`
        DROP SUBSCRIPTION IF EXISTS my_sub CASCADE
      `);
    });
  });
});
