import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("publications", () => {
  describe("CREATE PUBLICATION", () => {
    it(`formats CREATE PUBLICATION`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication
      `);
    });

    it(`formats FOR ALL TABLES/SEQUENCES`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR ALL TABLES
      `);
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR ALL SEQUENCES
      `);
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication_name_that_is_extra_long FOR
          ALL TABLES,
          ALL SEQUENCES
      `);
    });

    it(`formats FOR TABLE`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR TABLE foo
      `);
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR TABLE foo (column1, column2)
      `);
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR
          TABLE foo (column1, column2) WHERE (id > 10)
      `);
      // Not supported by parser
      // await testPostgresql(dedent`
      //   CREATE PUBLICATION my_publication FOR
      //     TABLE tbl1, tbl2 (col1) WHERE (col1 = 1), tbl3 (col2, col3)
      // `);
    });

    it(`formats FOR TABLES IN SCHEMA`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR TABLES IN SCHEMA my_schema
      `);
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR
          TABLES IN SCHEMA my_long_schema_name_in_here
      `);
      // Not supported by parser
      // await testPostgresql(dedent`
      //   CREATE PUBLICATION my_publication FOR TABLES IN SCHEMA schm1, schm2
      // `);
    });

    it(`formats multiple FOR clauses`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR
          TABLES IN SCHEMA my_long_schema_name_in_here,
          TABLE foo (column1, column2) WHERE (id > 10)
      `);
    });

    it(`formats WITH clause`, async () => {
      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR ALL TABLES WITH (publish = '')
      `);

      await testPostgresql(dedent`
        CREATE PUBLICATION my_publication FOR
          TABLES IN SCHEMA my_long_schema_name_in_here
        WITH (publish = 'insert, update')
      `);
    });
  });

  describe("ALTER PUBLICATION", () => {
    it(`formats RENAME TO`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication RENAME TO new_name
      `);
    });

    it(`formats OWNER TO`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication OWNER TO new_owner
      `);
    });

    it(`formats SET (...)`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication SET (param = 'value')
      `);
    });

    it(`formats ADD publication_object, ...`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication ADD TABLE foo, TABLES IN SCHEMA bar
      `);
    });

    it(`formats SET publication_object, ...`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication SET TABLE foo, TABLES IN SCHEMA bar
      `);
    });

    it(`formats DROP publication_object, ...`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication DROP TABLE foo, TABLES IN SCHEMA bar
      `);
    });

    it(`formats to multiple lines when long`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_publication
        DROP TABLE foo, TABLES IN SCHEMA bar, TABLE baz
      `);
    });

    it(`formats multiple publication objects to multiple lines`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_long_publication_name
        DROP
          TABLE first_table_name,
          TABLES IN SCHEMA my_schema_name,
          TABLE second_table_name
      `);
    });

    it(`formats to multiple lines when user prefers`, async () => {
      await testPostgresql(dedent`
        ALTER PUBLICATION my_pub
        ADD TABLE foo
      `);
    });
  });

  describe("DROP PUBLICATION", () => {
    it(`formats DROP PUBLICATION`, async () => {
      await testPostgresql(dedent`
        DROP PUBLICATION my_publication
      `);
      await testPostgresql(dedent`
        DROP PUBLICATION IF EXISTS my_publication1, my_publication2 CASCADE
      `);
    });
  });
});
