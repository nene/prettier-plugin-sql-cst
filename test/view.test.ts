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

    it(`formats CREATE OR REPLACE VIEW`, () => {
      test(
        dedent`
          CREATE OR REPLACE VIEW active_client_id AS
            SELECT 1
        `,
        { dialect: "bigquery" }
      );
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

    it(`formats CREATE VIEW with BigQuery options`, () => {
      test(
        dedent`
          CREATE VIEW foo
          OPTIONS(friendly_name = "newview")
          AS
            SELECT 1
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats simple CREATE MATERIALIZED VIEW`, () => {
      test(
        dedent`
          CREATE MATERIALIZED VIEW foo AS
            SELECT 1
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats CREATE MATERIALIZED VIEW with extra clauses`, () => {
      test(
        dedent`
          CREATE MATERIALIZED VIEW foo
          PARTITION BY DATE(col_datetime)
          CLUSTER BY col_int
          AS
            SELECT 1
        `,
        { dialect: "bigquery" }
      );
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

    it(`formats DROP MATERIALIZED VIEW`, () => {
      test(`DROP MATERIALIZED VIEW foo`);
    });
  });
});
