import dedent from "dedent-js";
import { test, testPostgresql } from "./test_utils";

describe("explain", () => {
  it(`formats EXPLAIN statement`, async () => {
    await test(`EXPLAIN SELECT 1`);
  });

  it(`formats EXPLAIN QUERY PLAIN statement`, async () => {
    await test(`EXPLAIN QUERY PLAN SELECT 1`);
  });

  it(`formats EXPLAIN ANALYZE statement`, async () => {
    await testPostgresql(`EXPLAIN ANALYZE SELECT 1`);
  });

  it(`formats EXPLAIN VERBOSE statement`, async () => {
    await testPostgresql(`EXPLAIN VERBOSE SELECT 1`);
    await testPostgresql(`EXPLAIN ANALYZE VERBOSE SELECT 1`);
  });

  it(`formats long EXPLAIN statement to multiple lines`, async () => {
    await test(dedent`
      EXPLAIN
        SELECT id, name, item_count
        FROM inventory
        WHERE item_count > 10
    `);
  });

  it(`formats long EXPLAIN QUERY PLAN statement to multiple lines`, async () => {
    await test(dedent`
      EXPLAIN QUERY PLAN
        SELECT id, name, item_count
        FROM inventory
        WHERE item_count > 10
    `);
  });
});
