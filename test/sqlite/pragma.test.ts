import { test } from "../test_utils";

describe("pragma", () => {
  it(`formats reading of PRAGMA value`, () => {
    test(`PRAGMA function_list`);
  });

  it(`formats PRAGMA assignment`, () => {
    test(`PRAGMA encoding = 'UTF-8'`);
  });

  it(`formats PRAGMA function call`, () => {
    test(`PRAGMA my_schema.wal_checkpoint(PASSIVE)`);
  });
});
