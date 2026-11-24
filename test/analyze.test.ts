import { test, testPostgresql } from "./test_utils";

describe("analyze", () => {
  it(`formats ANALYZE statement`, async () => {
    await test(`ANALYZE my_schema.my_table`);
  });

  it(`formats ANALYZE TABLE statement`, async () => {
    await test(`ANALYZE TABLE foo`);
  });

  it(`formats multiple tables`, async () => {
    await test(`ANALYZE foo, bar, baz`);
  });

  it(`formats multiple tables with column names and inheritance modifiers`, async () => {
    await testPostgresql(`ANALYZE foo *, ONLY bar, baz (a, b)`);
  });

  it(`formats plain ANALYZE statement`, async () => {
    await test(`ANALYZE`);
  });

  it(`formats ANALYZE VERBOSE`, async () => {
    await testPostgresql(`ANALYZE VERBOSE foo`);
  });

  it(`formats ANALYZE with options`, async () => {
    await testPostgresql(
      `ANALYZE (VERBOSE, SKIP_LOCKED OFF, BUFFER_USAGE_LIMIT 128) tbl`,
    );
  });
});
