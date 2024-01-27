import dedent from "dedent-js";
import { pretty, testBigquery, testPostgresql } from "../test_utils";

describe("function", () => {
  describe("create function", () => {
    it(`formats CREATE FUNCTION`, async () => {
      await testBigquery(dedent`
          CREATE FUNCTION my_func(arg1 INT64, arg2 STRING, arg3 ANY TYPE) AS
            (SELECT * FROM client)
        `);
    });

    it(`formats long parameter list to multiple lines`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION my_func(
          first_name STRING,
          last_name STRING,
          year_of_birth INT64
        ) AS
          (SELECT * FROM client)
      `);
    });

    it(`formats CREATE TEMP FUNCTION`, async () => {
      await testBigquery(dedent`
        CREATE TEMPORARY FUNCTION my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats OR REPLACE`, async () => {
      await testBigquery(dedent`
        CREATE OR REPLACE FUNCTION my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats IF NOT EXISTS`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func() AS
          (SELECT 1)
      `);
    });

    it(`formats RETURNS clause`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func()
        RETURNS INT64
        AS
          (SELECT 1)
      `);
    });

    it(`formats OPTIONS (...)`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION IF NOT EXISTS my_func()
        AS
          (SELECT 1)
        OPTIONS (description = 'constant-value function')
      `);
    });

    it(`formats CREATE TABLE FUNCTION`, async () => {
      await testBigquery(dedent`
        CREATE TABLE FUNCTION my_func()
        RETURNS TABLE<id INT, name STRING>
        AS
          (SELECT 1, 'John')
      `);
    });

    it(`formats creation of remote function`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT64
        REMOTE WITH CONNECTION us.myconnection
        OPTIONS (endpoint = 'https://us-central1-myproject.cloudfunctions.net/multi')
      `);
    });

    it(`formats JavaScript FUNCTION`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION gen_random()
        RETURNS FLOAT64
        NOT DETERMINISTIC
        LANGUAGE js
        AS r'''
          return Math.random();
        '''
      `);
    });

    it(`reformats JavaScript in JS function`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION gen_random()
            RETURNS FLOAT64
            LANGUAGE js
            AS ' if(true) {return Math.random () *2}'
          `,
          { dialect: "bigquery" },
        ),
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

    it(`quotes JavaScript in double-quotes when single-quotes can't be used`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION contains_quotes(x STRING)
            RETURNS FLOAT64
            LANGUAGE js
            AS " return /'''/.test(x) "
          `,
          { dialect: "bigquery" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION contains_quotes(x STRING)
        RETURNS FLOAT64
        LANGUAGE js
        AS r"""
          return /'''/.test(x);
        """
      `);
    });

    it(`does not reformat JavaScript when neither ''' or """ can be easily used for quoting`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION contains_quotes(x STRING)
            RETURNS FLOAT64
            LANGUAGE js
            AS " return /'''|\\"\\"\\"/.test(x) "
          `,
          { dialect: "bigquery" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION contains_quotes(x STRING)
        RETURNS FLOAT64
        LANGUAGE js
        AS " return /'''|\\"\\"\\"/.test(x) "
      `);
    });
  });

  describe("drop function", () => {
    it(`formats DROP FUNCTION`, async () => {
      await testBigquery(`DROP FUNCTION my_schema.my_func`);
    });
    it(`formats DROP TABLE FUNCTION`, async () => {
      await testBigquery(`DROP TABLE FUNCTION my_func`);
    });
    it(`formats IF EXISTS`, async () => {
      await testBigquery(`DROP FUNCTION IF EXISTS my_func`);
    });

    it(`formats parameter list`, async () => {
      await testPostgresql(`DROP FUNCTION my_func(foo INT, bar TEXT)`);
    });
    it(`formats long parameter list and CASCADE|RESTRICT`, async () => {
      await testPostgresql(dedent`
        DROP FUNCTION is_user_allowed_to_enter(
          user_id INT,
          event_id INT,
          OUT event_date DATE
        ) CASCADE
      `);
    });
  });
});
