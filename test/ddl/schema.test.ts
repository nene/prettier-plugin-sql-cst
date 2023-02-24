import dedent from "dedent-js";
import { test } from "../test_utils";

describe("schema", () => {
  describe("create schema", () => {
    it(`formats CREATE SCHEMA`, () => {
      test(
        dedent`
          CREATE SCHEMA schema_name
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats IF NOT EXISTS`, () => {
      test(
        dedent`
          CREATE SCHEMA IF NOT EXISTS schema_name
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats OPTIONS(..)`, () => {
      test(
        dedent`
          CREATE SCHEMA schema_name
          OPTIONS(friendly_name = 'Happy schema')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats DEFAULT COLLATE`, () => {
      test(
        dedent`
          CREATE SCHEMA schema_name
          DEFAULT COLLATE 'und:ci'
        `,
        { dialect: "bigquery" }
      );
    });
  });

  describe("drop schema", () => {
    it(`formats DROP SCHEMA`, () => {
      test(
        dedent`
          DROP SCHEMA schema_name
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats IF EXISTS`, () => {
      test(
        dedent`
          DROP SCHEMA IF EXISTS schema_name
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats CASCADE/RESTRICT`, () => {
      test(
        dedent`
          DROP SCHEMA schema_name CASCADE
        `,
        { dialect: "bigquery" }
      );
    });
  });

  describe("alter schema", () => {
    it(`formats ALTER SCHEMA .. SET OPTIONS`, () => {
      test(
        dedent`
          ALTER SCHEMA IF EXISTS my_schema
          SET OPTIONS(description = 'blah')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats ALTER SCHEMA .. SET DEFAULT COLLATE`, () => {
      test(
        dedent`
          ALTER SCHEMA my_schema
          SET DEFAULT COLLATE 'und:ci'
        `,
        { dialect: "bigquery" }
      );
    });
  });
});
