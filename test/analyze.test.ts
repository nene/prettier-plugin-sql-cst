import { test } from "./test_utils";

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

  it(`formats plain ANALYZE statement`, async () => {
    await test(`ANALYZE`);
  });
});
