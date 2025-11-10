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
  });
});
