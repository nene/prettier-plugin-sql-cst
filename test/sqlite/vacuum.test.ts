import { test } from "../test_utils";

describe("vacuum", () => {
  it(`formats VACUUM schema INTO file`, async () => {
    test(`VACUUM my_schema INTO 'my_file.sqlite'`);
  });

  it(`formats plain VACUUM statement`, async () => {
    test(`VACUUM`);
  });

  it(`formats VACUUM with just schema`, async () => {
    test(`VACUUM my_schema`);
  });

  it(`formats VACUUM with just INTO`, async () => {
    test(`VACUUM INTO 'my_file.sqlite'`);
  });
});
