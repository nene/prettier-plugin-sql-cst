import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("type", () => {
  describe("create type", () => {
    it(`formats CREATE TYPE name;`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE foo
      `);
    });

    it(`formats CREATE TYPE ... AS (...)`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE vec3 AS (x FLOAT, y FLOAT, z FLOAT)
      `);
    });

    it(`formats CREATE TYPE ... AS (...) with collations`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE name AS (first_name TEXT COLLATE "C", last_name TEXT COLLATE "C")
      `);
    });

    it(`formats CREATE TYPE ... AS (...) to multiple lines`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE name AS (
          first_name TEXT COLLATE "C",
          middle_name TEXT COLLATE "C",
          last_name TEXT COLLATE "C"
        )
      `);
    });

    it(`formats CREATE TYPE ... AS ENUM`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE color AS ENUM ('red', 'green', 'blue')
      `);
    });

    it(`formats CREATE TYPE ... AS ENUM to multiple lines`, async () => {
      await testPostgresql(dedent`
        CREATE TYPE color AS ENUM (
          'red',
          'green',
          'blue',
          'yellow',
          'purple',
          'orange',
          'black',
          'white'
        )
      `);
    });
  });

  describe("drop type", () => {
    it(`formats DROP TYPE`, async () => {
      await testPostgresql(dedent`
        DROP TYPE foo
      `);
    });

    it(`formats DROP TYPE ... IF EXISTS ... CASCADE`, async () => {
      await testPostgresql(dedent`
        DROP TYPE IF EXISTS foo CASCADE
      `);
    });

    it(`formats DROP TYPE with multiple names`, async () => {
      await testPostgresql(dedent`
        DROP TYPE foo, bar, baz
      `);
    });
  });
});
