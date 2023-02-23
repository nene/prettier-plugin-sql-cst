import dedent from "dedent-js";
import { pretty, test } from "../test_utils";

describe("function", () => {
  describe("create function", () => {
    it(`formats CREATE FUNCTION`, () => {
      test(
        dedent`
          CREATE FUNCTION my_func(arg1 INT64, arg2 STRING, arg3 ANY TYPE) AS
            (SELECT * FROM client)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long parameter list to multiple lines`, () => {
      test(
        dedent`
          CREATE FUNCTION my_func(
            first_name STRING,
            last_name STRING,
            year_of_birth INT64
          ) AS
            (SELECT * FROM client)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats CREATE TEMP FUNCTION`, () => {
      test(
        dedent`
          CREATE TEMPORARY FUNCTION my_func() AS
            (SELECT 1)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats OR REPLACE`, () => {
      test(
        dedent`
          CREATE OR REPLACE FUNCTION my_func() AS
            (SELECT 1)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats IF NOT EXISTS`, () => {
      test(
        dedent`
          CREATE FUNCTION IF NOT EXISTS my_func() AS
            (SELECT 1)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats RETURNS clause`, () => {
      test(
        dedent`
          CREATE FUNCTION IF NOT EXISTS my_func()
          RETURNS INT64
          AS
            (SELECT 1)
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats OPTIONS(...)`, () => {
      test(
        dedent`
          CREATE FUNCTION IF NOT EXISTS my_func()
          AS
            (SELECT 1)
          OPTIONS(description = 'constant-value function')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats CREATE TABLE FUNCTION`, () => {
      test(
        dedent`
          CREATE TABLE FUNCTION my_func()
          RETURNS TABLE<id INT, name STRING>
          AS
            (SELECT 1, 'John')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats creation of remote function`, () => {
      test(
        dedent`
          CREATE FUNCTION my_func()
          RETURNS INT64
          REMOTE WITH CONNECTION us.myconnection
          OPTIONS(endpoint = 'https://us-central1-myproject.cloudfunctions.net/multiply')
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats JavaScript FUNCTION`, () => {
      test(
        dedent`
          CREATE FUNCTION gen_random()
          RETURNS FLOAT64
          NOT DETERMINISTIC
          LANGUAGE js
          AS '''
            return Math.random();
          '''
        `,
        { dialect: "bigquery" }
      );
    });

    it(`reformats JavaScript in JS function`, () => {
      expect(
        pretty(
          dedent`
            CREATE FUNCTION gen_random()
            RETURNS FLOAT64
            LANGUAGE js
            AS ' if(true) {return Math.random () *2}'
          `,
          { dialect: "bigquery" }
        )
      ).toBe(dedent`
        CREATE FUNCTION gen_random()
        RETURNS FLOAT64
        LANGUAGE js
        AS '''
          if (true) {
            return Math.random() * 2;
          }
        '''
      `);
    });
  });

  describe("drop function", () => {
    it(`formats DROP FUNCTION`, () => {
      test(`DROP FUNCTION my_schema.my_func`, { dialect: "bigquery" });
    });

    it(`formats DROP TABLE FUNCTION`, () => {
      test(`DROP TABLE FUNCTION my_func`, { dialect: "bigquery" });
    });

    it(`formats IF EXISTS`, () => {
      test(`DROP FUNCTION IF EXISTS my_func`, { dialect: "bigquery" });
    });
  });
});
