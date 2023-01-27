import dedent from "dedent-js";
import { test } from "./test_utils";

describe("view", () => {
  describe("create view", () => {
    it(`formats CREATE VIEW`, () => {
      test(dedent`
        CREATE VIEW active_client_id AS
          SELECT id FROM client WHERE active = TRUE
      `);
    });

    it(`formats CREATE TEMPORARY VIEW IF NOT EXISTS`, () => {
      test(dedent`
        CREATE TEMPORARY VIEW IF NOT EXISTS active_client_id AS
          SELECT 1
      `);
    });

    it(`formats CREATE VIEW with column list`, () => {
      test(dedent`
        CREATE VIEW foobar (col1, col2, col3) AS
          SELECT 1
      `);
    });

    it(`formats CREATE VIEW with long column list`, () => {
      test(dedent`
        CREATE VIEW active_client_in_queue (
          client_name,
          client_org_name,
          status,
          priority_index
        ) AS
          SELECT * FROM client
      `);
    });
  });

  describe("drop view", () => {
    it(`formats DROP VIEW`, () => {
      test(dedent`
        DROP VIEW active_client_view
      `);
    });

    it(`formats DROP VIEW IF EXISTS`, () => {
      test(dedent`
        DROP VIEW IF EXISTS my_schema.active_client_view
      `);
    });
  });
});
