import { test } from "../test_utils";

describe("reindex", () => {
  it(`formats REINDEX`, async () => {
    test(`REINDEX my_schema.my_table`);
  });

  it(`formats plain REINDEX`, async () => {
    test(`REINDEX`);
  });
});
