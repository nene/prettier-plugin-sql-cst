import { test } from "../test_utils";

describe("reindex", () => {
  it(`formats REINDEX`, () => {
    test(`REINDEX my_schema.my_table`);
  });

  it(`formats plain REINDEX`, () => {
    test(`REINDEX`);
  });
});
