import dedent from "dedent-js";
import { test } from "./test_utils";

describe("explain", () => {
  it(`formats EXPLAIN statement`, () => {
    test(`EXPLAIN SELECT 1`);
  });

  it(`formats EXPLAIN QUERY PLAIN statement`, () => {
    test(`EXPLAIN QUERY PLAN SELECT 1`);
  });

  it(`formats long EXPLAIN statement to multiple lines`, () => {
    test(dedent`
      EXPLAIN
        SELECT id, name, item_count
        FROM inventory
        WHERE item_count > 10
    `);
  });

  it(`formats long EXPLAIN QUERY PLAN statement to multiple lines`, () => {
    test(dedent`
      EXPLAIN QUERY PLAN
        SELECT id, name, item_count
        FROM inventory
        WHERE item_count > 10
    `);
  });
});
