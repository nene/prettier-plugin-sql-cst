import dedent from "dedent-js";
import { test, testBigquery, testMysql, testPostgresql } from "../test_utils";

describe("create table", () => {
  it(`formats CREATE TABLE always on multiple lines`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR(100),
        org_id INT
      )
    `);
  });

  it(`formats CREATE TEMPORARY TABLE`, async () => {
    await test(dedent`
      CREATE TEMPORARY TABLE foo (
        id INT
      )
    `);
  });

  it(`formats IF NOT EXISTS`, async () => {
    await test(dedent`
      CREATE TABLE IF NOT EXISTS foo (
        id INT
      )
    `);
  });

  it(`formats OR REPLACE`, async () => {
    await testBigquery(dedent`
      CREATE OR REPLACE TABLE foo (
        id INT
      )
    `);
  });

  it(`formats CREATE TABLE with various data types`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INTEGER,
        name VARCHAR(100),
        price DECIMAL(10, 5),
        age UNSIGNED BIG INT,
        organization_name NATIVE CHARACTER (70)
      )
    `);
  });

  it(`formats CREATE TABLE with column constraints`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT NOT NULL PRIMARY KEY,
        fname VARCHAR(100) NULL,
        lname VARCHAR(100) UNIQUE COLLATE RTRIM,
        age VARCHAR(6) DEFAULT 0,
        organization_id INT REFERENCES organization (id),
        byear1 INT GENERATED ALWAYS AS (today - age) VIRTUAL,
        byear2 INT AS (today - age)
      )
    `);
  });

  it(`formats SQLite PRIMARY KEY modifiers`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INTEGER PRIMARY KEY ASC AUTOINCREMENT
      )
    `);
  });

  it(`format MySQL column constraints`, async () => {
    await testMysql(dedent`
      CREATE TABLE client (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fname VARCHAR(100) COMMENT 'First name',
        lname VARCHAR(100) KEY,
        age INT INVISIBLE,
        org_id INT COLUMN_FORMAT FIXED STORAGE DISK,
        content1 TEXT ENGINE_ATTRIBUTE '{ "indexing": "btree" }',
        content2 TEXT SECONDARY_ENGINE_ATTRIBUTE = '{ "indexing": "hashmap" }'
      )
    `);
  });

  it(`formats CREATE TABLE with table constraints`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR,
        PRIMARY KEY (id, name),
        UNIQUE (name),
        CHECK (id > 0),
        FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `);
  });

  it(`formats MySQL table constraints`, async () => {
    await testMysql(dedent`
      CREATE TABLE client (
        id INT,
        name TEXT,
        KEY (id, name),
        FULLTEXT INDEX (name)
      )
    `);
  });

  it(`formats FOREIGN KEY constraint with options`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        FOREIGN KEY (org_id1) REFERENCES organization (id1)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        FOREIGN KEY (org_id3) REFERENCES organization (id3)
          MATCH FULL
      )
    `);
  });

  it(`formats deferrable FOREIGN KEY constraint`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        CONSTRAINT fkey
          FOREIGN KEY (org_id1) REFERENCES organization (id1)
            DEFERRABLE,
        FOREIGN KEY (org_id2) REFERENCES organization (id2)
          NOT DEFERRABLE INITIALLY DEFERRED
      )
    `);
  });

  it(`formats CREATE TABLE with named column constraints`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT CONSTRAINT NOT NULL CONSTRAINT prim_key PRIMARY KEY
      )
    `);
  });

  it(`formats CREATE TABLE with named table constraints`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        CONSTRAINT prim_key PRIMARY KEY (id, name),
        CONSTRAINT org_for_key
          FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `);
  });

  it(`formats constraints with ON CONFLICT clause`, async () => {
    await test(dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR(100) NOT NULL ON CONFLICT FAIL,
        uuid INT UNIQUE ON CONFLICT ROLLBACK,
        CONSTRAINT prim_key PRIMARY KEY (id) ON CONFLICT ABORT
      )
    `);
  });

  it(`formats BigQuery data types with internal constraints`, async () => {
    await testBigquery(dedent`
      CREATE TABLE client (
        arr_field ARRAY<INT64 NOT NULL>,
        struct_field STRUCT<name STRING NOT NULL, age INT64 DEFAULT 0>,
        meta OPTIONS (description = 'Metadata in here')
      )
    `);
  });

  // Issue #10
  it(`formats long BigQuery struct definition to multiple lines`, async () => {
    await testBigquery(dedent`
      CREATE TABLE client (
        struct_field STRUCT<
          first_name STRING,
          last_name STRING,
          email STRING,
          address STRING,
          phone_number STRING
        >
      )
    `);
  });

  it(`formats PostgreSQL array data types`, async () => {
    await testPostgresql(dedent`
      CREATE TABLE client (
        arr_field INT[],
        arr_field2 INT[10][10],
        arr_field3 INT[][]
      )
    `);
  });

  it(`formats TIME ZONE modifier on TIME data types`, async () => {
    await testPostgresql(dedent`
      CREATE TABLE client (
        from_date TIME WITH TIME ZONE,
        to_date TIMESTAMP(5) WITHOUT TIME ZONE
      )
    `);
  });

  it(`formats SQLite table options`, async () => {
    await test(dedent`
      CREATE TABLE foo (
        id INT
      )
      WITHOUT ROWID, STRICT
    `);
  });

  it(`formats MySQL table options`, async () => {
    await testMysql(dedent`
      CREATE TABLE foo (
        id INT
      )
      AUTOEXTEND_SIZE = 10,
      AVG_ROW_LENGTH = 100,
      DEFAULT CHARACTER SET latin1,
      COMMENT = 'hello'
    `);
  });

  it(`formats single short BigQuery extra CREATE TABLE clause`, async () => {
    await testBigquery(dedent`
      CREATE TABLE client (
        id INT64
      )
      DEFAULT COLLATE 'und:ci'
    `);
  });

  it(`formats additional BigQuery CREATE TABLE clauses`, async () => {
    await testBigquery(dedent`
      CREATE TABLE client (
        id INT64
      )
      DEFAULT COLLATE 'und:ci'
      PARTITION BY _PARTITIONDATE
      CLUSTER BY customer_id
      OPTIONS (friendly_name = 'Clientele')
    `);
  });

  it(`formats long BigQuery OPTIONS ()`, async () => {
    await testBigquery(dedent`
      CREATE TABLE client (
        id INT64
      )
      OPTIONS (
        expiration_timestamp = TIMESTAMP "2025-01-01 00:00:00 UTC",
        partition_expiration_days = 1,
        description = "a table that expires in 2025, with each partition living for 24 hours",
        labels = [("org_unit", "development")]
      )
    `);
  });

  it(`formats CREATE TABLE AS`, async () => {
    await test(dedent`
      CREATE TABLE foo AS
        SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`formats CREATE TABLE AS with long query`, async () => {
    await test(dedent`
      CREATE TABLE foo AS
        SELECT column1, column2, column3
        FROM external_client
        WHERE external_client.payment > external_client.income
    `);
  });

  it(`formats CREATE TABLE AS with column definitions`, async () => {
    await testMysql(dedent`
      CREATE TABLE foo (
        id INT,
        name VARCHAR(100)
      ) AS
        SELECT * FROM tbl WHERE x > 0
    `);
  });

  it(`formats CREATE TABLE LIKE`, async () => {
    await testBigquery(dedent`
      CREATE TABLE foo
      LIKE my_old_table
    `);
  });

  it(`formats CREATE TABLE COPY`, async () => {
    await testBigquery(dedent`
      CREATE TABLE foo
      COPY my_old_table
    `);
  });

  it(`formats CREATE SNAPSHOT TABLE CLONE`, async () => {
    await testBigquery(dedent`
      CREATE SNAPSHOT TABLE foo
      CLONE my_old_table
    `);
  });

  it(`formats FOR SYSTEM_TIME AS OF`, async () => {
    await testBigquery(dedent`
      CREATE SNAPSHOT TABLE foo
      CLONE my_old_table FOR SYSTEM_TIME AS OF '2017-01-01 10:00:00-07:00'
    `);
  });

  it(`formats CREATE EXTERNAL TABLE`, async () => {
    await testBigquery(dedent`
      CREATE EXTERNAL TABLE dataset.CustomTable (
        id INT64
      )
      WITH CONNECTION myproj.dataset.connectionId
      WITH PARTITION COLUMNS (field_1 STRING, field_2 INT64)
      OPTIONS (format = 'PARQUET')
    `);
  });

  it(`formats CREATE EXTERNAL TABLE with long PARTITION COLUMNS list`, async () => {
    await testBigquery(dedent`
      CREATE EXTERNAL TABLE dataset.CustomTable
      WITH PARTITION COLUMNS (
        first_name STRING,
        last_name STRING,
        average_income INT64,
        waist_height INT64
      )
    `);
  });

  it(`formats CREATE VIRTUAL TABLE`, async () => {
    await test(dedent`
      CREATE VIRTUAL TABLE my_table
      USING my_func(1, 2)
    `);
  });
});
