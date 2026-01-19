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
      await testPostgresql(dedent`
        CREATE FUNCTION my_func(
          IN first_name TEXT,
          OUT last_name TEXT,
          year_of_birth INT DEFAULT 2000,
          INOUT age INT = 0,
          VARIADIC other_names TEXT[]
        ) AS 'SELECT 1'
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
        CREATE FUNCTION my_func()
        RETURNS INT64
        AS
          (SELECT 1)
      `);
    });

    it(`formats RETURNS TABLE`, async () => {
      await testPostgresql(dedent`
        CREATE FUNCTION foo()
        RETURNS TABLE (id INT, name TEXT)
        AS 'SELECT 1'
      `);
    });

    it(`formats OPTIONS (...)`, async () => {
      await testBigquery(dedent`
        CREATE FUNCTION my_func()
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

    it(`formats PostgreSQL-specific clauses`, async () => {
      await testPostgresql(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE SQL
        IMMUTABLE
        NOT LEAKPROOF
        CALLED ON NULL INPUT
        EXTERNAL SECURITY DEFINER
        PARALLEL UNSAFE
        COST 100
        ROWS 1000
        SUPPORT schm.foo
        TRANSFORM FOR TYPE INT, FOR TYPE VARCHAR(100)
        RETURN 5 + 5
      `);
    });

    it(`formats WINDOW function loaded from object file`, async () => {
      await testPostgresql(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        AS 'my_lib.so', 'my_func'
        LANGUAGE C
        WINDOW
        STRICT
      `);
    });

    it(`formats SET config variables`, async () => {
      await testPostgresql(dedent`
        CREATE FUNCTION my_func()
        SET search_path TO my_schema, my_other_schema
        SET check_function_bodies = DEFAULT
        SET client_min_messages FROM CURRENT
        BEGIN ATOMIC
          RETURN 1;
        END
      `);
    });

    describe("LANGUAGE js", () => {
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

    describe("LANGUAGE sql", () => {
      it(`formats dollar-quoted SQL function`, async () => {
        await testPostgresql(dedent`
          CREATE FUNCTION my_func()
          RETURNS INT64
          LANGUAGE sql
          AS $$
            SELECT 1;
          $$
        `);
      });

      it(`reformats SQL in dollar-quoted SQL function`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE FUNCTION my_func()
              RETURNS INT64
              LANGUAGE sql
              AS $body$SELECT 1;
              select 2$body$
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE FUNCTION my_func()
          RETURNS INT64
          LANGUAGE sql
          AS $body$
            SELECT 1;
            SELECT 2;
          $body$
        `);
      });

      it(`converts single-quoted SQL function to dollar-quoted SQL function`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE FUNCTION my_func()
              RETURNS TEXT
              LANGUAGE sql
              AS 'SELECT ''foo'''
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE FUNCTION my_func()
          RETURNS TEXT
          LANGUAGE sql
          AS $$
            SELECT 'foo';
          $$
        `);
      });

      it(`does not reformat single-quoted SQL function when its source contains $$-quotes`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE FUNCTION my_func()
              RETURNS TEXT
              LANGUAGE sql
              AS 'SELECT $$foo$$'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE FUNCTION my_func()
          RETURNS TEXT
          LANGUAGE sql
          AS 'SELECT $$foo$$'
        `);
      });

      it(`handles SQL language identifier case-insensitively`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE FUNCTION my_func()
              RETURNS INT64
              LANGUAGE Sql
              AS 'SELECT 1'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE FUNCTION my_func()
          RETURNS INT64
          LANGUAGE Sql
          AS $$
            SELECT 1;
          $$
        `);
      });
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
