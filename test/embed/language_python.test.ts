import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

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
