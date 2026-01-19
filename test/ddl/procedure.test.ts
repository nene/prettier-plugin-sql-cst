import dedent from "dedent-js";
import { pretty, testBigquery, testPostgresql } from "../test_utils";

describe("procedure", () => {
  describe("create procedure", () => {
    it(`formats CREATE PROCEDURE`, async () => {
      await testBigquery(
        dedent`
          CREATE PROCEDURE drop_my_table(arg1 INT64, OUT arg2 STRING)
          BEGIN
            DROP TABLE my_table;
          END
        `,
      );
    });

    it(`formats OR REPLACE / IF NOT EXISTS`, async () => {
      await testBigquery(
        dedent`
          CREATE OR REPLACE PROCEDURE IF NOT EXISTS drop_my_table()
          BEGIN
            DROP TABLE my_table;
          END
        `,
      );
    });

    it(`formats long parameter list`, async () => {
      await testBigquery(
        dedent`
          CREATE PROCEDURE my_schema.my_long_procedure_name(
            IN first_parameter INT64,
            INOUT second_parameter STRING,
            OUT third_parameter INT64
          )
          BEGIN
            DROP TABLE my_table;
          END
        `,
      );
    });

    it(`formats default parameter values`, async () => {
      await testPostgresql(
        dedent`
          CREATE PROCEDURE eliminate_tbl(id INT = 1, TEXT DEFAULT 'foo')
          BEGIN ATOMIC
            DROP TABLE my_table;
          END
        `,
      );
    });

    it(`formats OPTIONS (..)`, async () => {
      await testBigquery(
        dedent`
          CREATE PROCEDURE foo()
          OPTIONS (strict_mode = TRUE)
          BEGIN
            DROP TABLE my_table;
          END
        `,
      );
    });

    describe("LANGUAGE PYTHON", () => {
      it(`formats remote python procedure`, async () => {
        await testBigquery(
          dedent`
            CREATE PROCEDURE my_bq_project.my_dataset.spark_proc()
            WITH CONNECTION \`my-project-id.us.my-connection\`
            OPTIONS (engine = "SPARK", main_file_uri = "gs://my-bucket/my-pyspark-main.py")
            LANGUAGE PYTHON
          `,
        );
      });

      it(`formats inline python procedure`, async () => {
        await testBigquery(
          dedent`
            CREATE PROCEDURE spark_proc()
            WITH CONNECTION my_connection
            OPTIONS (engine = "SPARK")
            LANGUAGE PYTHON
            AS r'''
              from pyspark.sql import SparkSession
              spark = SparkSession.builder.appName("spark-bigquery-demo").getOrCreate()
              # Load data from BigQuery.
              words = spark.read.format("bigquery")
            '''
          `,
        );
      });
    });

    describe("LANGUAGE sql", () => {
      it(`formats dollar-quoted SQL procedure`, async () => {
        await testPostgresql(dedent`
          CREATE PROCEDURE my_proc()
          LANGUAGE sql
          AS $$
            SELECT 1;
          $$
        `);
      });

      it(`reformats SQL in dollar-quoted SQL procedure`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE PROCEDURE my_proc()
              LANGUAGE sql
              AS $body$SELECT 1;
              select 2$body$
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE PROCEDURE my_proc()
          LANGUAGE sql
          AS $body$
            SELECT 1;
            SELECT 2;
          $body$
        `);
      });

      it(`converts single-quoted SQL procedures to dollar-quoted SQL procedures`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE PROCEDURE my_proc()
              LANGUAGE sql
              AS 'SELECT ''foo'''
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE PROCEDURE my_proc()
          LANGUAGE sql
          AS $$
            SELECT 'foo';
          $$
        `);
      });

      it(`does not convert single-quoted SQL procedures to dollar-quoted SQL procedures when they contain dollar-quoted strings`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE PROCEDURE my_proc()
              LANGUAGE sql
              AS 'SELECT $$foo$$'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE PROCEDURE my_proc()
          LANGUAGE sql
          AS 'SELECT $$foo$$'
        `);
      });

      it(`handles SQL language identifier case-insensitively`, async () => {
        expect(
          await pretty(
            dedent`
              CREATE PROCEDURE my_proc()
              LANGUAGE Sql
              AS 'SELECT 1'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          CREATE PROCEDURE my_proc()
          LANGUAGE Sql
          AS $$
            SELECT 1;
          $$
        `);
      });
    });
  });

  describe("drop procedure", () => {
    it(`formats DROP PROCEDURE`, async () => {
      await testBigquery(`DROP PROCEDURE mydataset.myProcedure`);
    });

    it(`formats IF EXISTS`, async () => {
      await testBigquery(`DROP PROCEDURE IF EXISTS foo`);
    });

    it(`formats parameter list`, async () => {
      await testPostgresql(`DROP PROCEDURE my_func(foo INT, bar TEXT)`);
    });
    it(`formats long parameter list and CASCADE|RESTRICT`, async () => {
      await testPostgresql(dedent`
        DROP PROCEDURE is_user_allowed_to_enter(
          user_id INT,
          event_id INT,
          OUT event_date DATE
        ) RESTRICT
      `);
    });
  });
});
