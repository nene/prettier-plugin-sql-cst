import dedent from "dedent-js";
import { pretty, testBigquery } from "../test_utils";

describe("function", () => {
  describe("create function", () => {
    it(`formats CREATE FUNCTION`, () => {
      testBigquery(dedent`
          CREATE FUNCTION my_func(arg1 INT64, arg2 STRING, arg3 ANY TYPE) AS
            (SELECT * FROM client)
        `);
    });

    it(`formats long parameter list to multiple lines`, () => {
      testBigquery(dedent`
        CREATE FUNCTION my_func(
          first_name STRING,
          last_name STRING,
          year_of_birth INT64
        ) AS
          (SELECT * FROM client)
      `);
    });

    it(`formats CREATE TEMP FUNCTION`, () => {
      testBigquery(dedent`
        CREATE TEMPORARY FUNCTION my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats OR REPLACE`, () => {
      testBigquery(dedent`
        CREATE OR REPLACE FUNCTION my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats IF NOT EXISTS`, () => {
      testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats RETURNS clause`, () => {
      testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func()
        RETURNS INT64
        AS
          (SELECT 1)
      `);
    });

    it(`formats OPTIONS (...)`, () => {
      testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func()
        AS
          (SELECT 1)
        OPTIONS (description = 'constant-value function')
      `);
    });

    it(`formats CREATE TABLE FUNCTION`, () => {
      testBigquery(dedent`
        CREATE TABLE FUNCTION my_func()
        RETURNS TABLE<id INT, name STRING>
        AS
          (SELECT 1, 'John')
      `);
    });

    it(`formats creation of remote function`, () => {
      testBigquery(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT64
        REMOTE WITH CONNECTION us.myconnection
        OPTIONS (endpoint = 'https://us-central1-myproject.cloudfunctions.net/multi')
      `);
    });

    it(`formats JavaScript FUNCTION`, () => {
      testBigquery(dedent`
        CREATE FUNCTION gen_random()
        RETURNS FLOAT64
        NOT DETERMINISTIC
        LANGUAGE js
        AS r'''
          return Math.random();
        '''
      `);
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
        AS r'''
          if (true) {
            return Math.random() * 2;
          }
        '''
      `);
    });

    it(`quotes JavaScript in double-quotes when single-quotes can't be used`, () => {
      expect(
        pretty(
          dedent`
            CREATE FUNCTION contains_quotes(x STRING)
            RETURNS FLOAT64
            LANGUAGE js
            AS " return /'''/.test(x) "
          `,
          { dialect: "bigquery" }
        )
      ).toBe(dedent`
        CREATE FUNCTION contains_quotes(x STRING)
        RETURNS FLOAT64
        LANGUAGE js
        AS r"""
          return /'''/.test(x);
        """
      `);
    });

    it(`does not reformat JavaScript when neither ''' or """ can be easily used for quoting`, () => {
      expect(
        pretty(
          dedent`
            CREATE FUNCTION contains_quotes(x STRING)
            RETURNS FLOAT64
            LANGUAGE js
            AS " return /'''|\\"\\"\\"/.test(x) "
          `,
          { dialect: "bigquery" }
        )
      ).toBe(dedent`
        CREATE FUNCTION contains_quotes(x STRING)
        RETURNS FLOAT64
        LANGUAGE js
        AS " return /'''|\\"\\"\\"/.test(x) "
      `);
    });
  });

  describe("drop function", () => {
    it(`formats DROP FUNCTION`, () => {
      testBigquery(`DROP FUNCTION my_schema.my_func`);
    });
    it(`formats DROP TABLE FUNCTION`, () => {
      testBigquery(`DROP TABLE FUNCTION my_func`);
    });
    it(`formats IF EXISTS`, () => {
      testBigquery(`DROP FUNCTION IF EXISTS my_func`);
    });
  });
});
