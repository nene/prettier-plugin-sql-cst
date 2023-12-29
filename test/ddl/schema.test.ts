import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("schema", () => {
  describe("create schema", () => {
    it(`formats CREATE SCHEMA`, async () => {
      await testBigquery(
        dedent`
          CREATE SCHEMA schema_name
        `,
      );
    });

    it(`formats IF NOT EXISTS`, async () => {
      await testBigquery(
        dedent`
          CREATE SCHEMA IF NOT EXISTS schema_name
        `,
      );
    });

    it(`formats OPTIONS (..)`, async () => {
      await testBigquery(
        dedent`
          CREATE SCHEMA schema_name
          OPTIONS (friendly_name = 'Happy schema')
        `,
      );
    });

    it(`formats DEFAULT COLLATE`, async () => {
      await testBigquery(
        dedent`
          CREATE SCHEMA schema_name
          DEFAULT COLLATE 'und:ci'
        `,
      );
    });
  });

  describe("drop schema", () => {
    it(`formats DROP SCHEMA`, async () => {
      await testBigquery(
        dedent`
          DROP SCHEMA schema_name
        `,
      );
    });

    it(`formats IF EXISTS`, async () => {
      await testBigquery(
        dedent`
          DROP SCHEMA IF EXISTS schema_name
        `,
      );
    });

    it(`formats CASCADE/RESTRICT`, async () => {
      await testBigquery(
        dedent`
          DROP SCHEMA schema_name CASCADE
        `,
      );
    });
  });

  describe("alter schema", () => {
    it(`formats ALTER SCHEMA .. SET OPTIONS`, async () => {
      await testBigquery(
        dedent`
          ALTER SCHEMA IF EXISTS my_schema
          SET OPTIONS (description = 'blah')
        `,
      );
    });

    it(`formats ALTER SCHEMA .. SET DEFAULT COLLATE`, async () => {
      await testBigquery(
        dedent`
          ALTER SCHEMA my_schema
          SET DEFAULT COLLATE 'und:ci'
        `,
      );
    });
  });
});
