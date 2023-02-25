import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("schema", () => {
  describe("create schema", () => {
    it(`formats CREATE SCHEMA`, () => {
      testBigquery(
        dedent`
          CREATE SCHEMA schema_name
        `
      );
    });

    it(`formats IF NOT EXISTS`, () => {
      testBigquery(
        dedent`
          CREATE SCHEMA IF NOT EXISTS schema_name
        `
      );
    });

    it(`formats OPTIONS(..)`, () => {
      testBigquery(
        dedent`
          CREATE SCHEMA schema_name
          OPTIONS(friendly_name = 'Happy schema')
        `
      );
    });

    it(`formats DEFAULT COLLATE`, () => {
      testBigquery(
        dedent`
          CREATE SCHEMA schema_name
          DEFAULT COLLATE 'und:ci'
        `
      );
    });
  });

  describe("drop schema", () => {
    it(`formats DROP SCHEMA`, () => {
      testBigquery(
        dedent`
          DROP SCHEMA schema_name
        `
      );
    });

    it(`formats IF EXISTS`, () => {
      testBigquery(
        dedent`
          DROP SCHEMA IF EXISTS schema_name
        `
      );
    });

    it(`formats CASCADE/RESTRICT`, () => {
      testBigquery(
        dedent`
          DROP SCHEMA schema_name CASCADE
        `
      );
    });
  });

  describe("alter schema", () => {
    it(`formats ALTER SCHEMA .. SET OPTIONS`, () => {
      testBigquery(
        dedent`
          ALTER SCHEMA IF EXISTS my_schema
          SET OPTIONS(description = 'blah')
        `
      );
    });

    it(`formats ALTER SCHEMA .. SET DEFAULT COLLATE`, () => {
      testBigquery(
        dedent`
          ALTER SCHEMA my_schema
          SET DEFAULT COLLATE 'und:ci'
        `
      );
    });
  });
});
