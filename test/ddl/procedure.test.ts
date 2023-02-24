import dedent from "dedent-js";
import { test } from "../test_utils";

describe("procedure", () => {
  describe("create procedure", () => {
    it(`formats CREATE PROCEDURE`, () => {
      test(
        dedent`
          CREATE PROCEDURE drop_my_table(arg1 INT64, OUT arg2 STRING)
          BEGIN
            DROP TABLE my_table;
          END
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats OR REPLACE / IF NOT EXISTS`, () => {
      test(
        dedent`
          CREATE OR REPLACE PROCEDURE IF NOT EXISTS drop_my_table()
          BEGIN
            DROP TABLE my_table;
          END
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats long parameter list`, () => {
      test(
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
        { dialect: "bigquery" }
      );
    });

    it(`formats OPTIONS(..)`, () => {
      test(
        dedent`
          CREATE PROCEDURE foo()
          OPTIONS(strict_mode = TRUE)
          BEGIN
            DROP TABLE my_table;
          END
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats remote python procedure`, () => {
      test(
        dedent`
          CREATE PROCEDURE my_bq_project.my_dataset.spark_proc()
          WITH CONNECTION \`my-project-id.us.my-connection\`
          OPTIONS(engine = "SPARK", main_file_uri = "gs://my-bucket/my-pyspark-main.py")
          LANGUAGE PYTHON
        `,
        { dialect: "bigquery" }
      );
    });

    it(`formats inline python procedure`, () => {
      test(
        dedent`
          CREATE PROCEDURE spark_proc()
          WITH CONNECTION my_connection
          OPTIONS(engine = "SPARK")
          LANGUAGE PYTHON
          AS r'''
            from pyspark.sql import SparkSession
            spark = SparkSession.builder.appName("spark-bigquery-demo").getOrCreate()
            # Load data from BigQuery.
            words = spark.read.format("bigquery")
          '''
        `,
        { dialect: "bigquery" }
      );
    });
  });

  describe("drop procedure", () => {
    it(`formats DROP PROCEDURE`, () => {
      test(`DROP PROCEDURE mydataset.myProcedure`, { dialect: "bigquery" });
    });

    it(`formats IF EXISTS`, () => {
      test(`DROP PROCEDURE IF EXISTS foo`, { dialect: "bigquery" });
    });
  });
});
