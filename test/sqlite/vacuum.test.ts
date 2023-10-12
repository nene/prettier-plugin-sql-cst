import { test } from "../test_utils";

describe("vacuum", () => {
  it(`formats VACUUM schema INTO file`, async () => {
    await test(`VACUUM my_schema INTO 'my_file.sqlite'`);
  });

  it(`formats plain VACUUM statement`, async () => {
    await test(`VACUUM`);
  });

  it(`formats VACUUM with just schema`, async () => {
    await test(`VACUUM my_schema`);
  });

  it(`formats VACUUM with just INTO`, async () => {
    await test(`VACUUM INTO 'my_file.sqlite'`);
  });
});
