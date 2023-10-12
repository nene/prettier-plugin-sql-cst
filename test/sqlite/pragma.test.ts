import { test } from "../test_utils";

describe("pragma", () => {
  it(`formats reading of PRAGMA value`, async () => {
    await test(`PRAGMA function_list`);
  });

  it(`formats PRAGMA assignment`, async () => {
    await test(`PRAGMA encoding = 'UTF-8'`);
  });

  it(`formats PRAGMA function call`, async () => {
    await test(`PRAGMA my_schema.wal_checkpoint(PASSIVE)`);
  });
});
