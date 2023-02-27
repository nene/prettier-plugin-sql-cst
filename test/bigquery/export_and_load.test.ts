import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("export & load", () => {
  it(`formats EXPORT DATA`, () => {
    testBigquery(dedent`
      EXPORT DATA
      OPTIONS (uri = 'gs://bucket/folder/*.csv', format = 'CSV')
      AS
        SELECT field1, field2 FROM mydataset.table1
    `);
  });

  it(`formats EXPORT DATA with CONNECTION`, () => {
    testBigquery(dedent`
      EXPORT DATA
      WITH CONNECTION myproject.us.myconnection
      OPTIONS (uri = 'gs://bucket/folder/*.csv', format = 'CSV')
      AS
        SELECT field1, field2 FROM mydataset.table1
    `);
  });

  it(`formats LOAD DATA`, () => {
    testBigquery(dedent`
      LOAD DATA INTO mydataset.table1
      FROM FILES (format = 'AVRO', uris = ['gs://bucket/path/file.avro'])
    `);
  });

  it(`formats LOAD DATA with columns`, () => {
    testBigquery(dedent`
      LOAD DATA INTO mydataset.table1 (x INT64, y STRING)
      OPTIONS (description = "my table")
      FROM FILES (format = 'AVRO', uris = ['gs://bucket/path/file.avro'])
    `);
  });

  it(`formats LOAD DATA with long column list`, () => {
    testBigquery(dedent`
      LOAD DATA INTO mydataset.table1 (
        first_field INT64,
        second_field STRING,
        field_1 STRING,
        field_2 INT64
      )
      FROM FILES (uris = ['gs://bucket/path/file.avro'])
    `);
  });

  it(`formats LOAD DATA with PARTITION/CLUSTER BY & WITH PARTITION COLUMNS & CONNECTION`, () => {
    testBigquery(dedent`
      LOAD DATA INTO mydataset.table1
      PARTITION BY transaction_date
      CLUSTER BY customer_id
      FROM FILES (
        format = 'AVRO',
        uris = ['gs://bucket/path/file.avro'],
        hive_partition_uri_prefix = 'gs://bucket/path'
      )
      WITH PARTITION COLUMNS (field_1 STRING, field_2 INT64)
      WITH CONNECTION myproject.us.myconnection
    `);
  });
});
