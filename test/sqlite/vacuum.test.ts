import { test, testPlpgsql } from "../test_utils";

describe("vacuum", () => {
  it(`formats plain VACUUM statement`, async () => {
    await test(`VACUUM`);
  });

  // in SQLite
  describe("vacuum database", () => {
    it(`formats VACUUM schema INTO file`, async () => {
      await test(`VACUUM my_schema INTO 'my_file.sqlite'`);
    });

    it(`formats VACUUM with just schema`, async () => {
      await test(`VACUUM my_schema`);
    });

    it(`formats VACUUM with just INTO`, async () => {
      await test(`VACUUM INTO 'my_file.sqlite'`);
    });
  });

  // in PostgreSQL
  describe("vacuum table", () => {
    it(`formats VACUUM with table name and inheritance modifiers`, async () => {
      await testPlpgsql(`VACUUM schm.my_table`);
      await testPlpgsql(`VACUUM ONLY my_table, my_table *`);
    });

    it(`formats VACUUM with multiple tables and column names`, async () => {
      await testPlpgsql(`VACUUM tbl1 (a), tbl2 (a, b)`);
    });

    it(`formats VACUUM with options`, async () => {
      await testPlpgsql(`VACUUM (FULL, VERBOSE ON, INDEX_CLEANUP AUTO) tbl1`);
    });

    it(`formats VACUUM with modifiers`, async () => {
      await testPlpgsql(`VACUUM FULL FREEZE VERBOSE ANALYZE tbl1`);
    });
  });
});
