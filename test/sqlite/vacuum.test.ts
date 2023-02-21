import { test } from "../test_utils";

describe("vacuum", () => {
  it(`formats VACUUM schema INTO file`, () => {
    test(`VACUUM my_schema INTO 'my_file.sqlite'`);
  });

  it(`formats plain VACUUM statement`, () => {
    test(`VACUUM`);
  });

  it(`formats VACUUM with just schema`, () => {
    test(`VACUUM my_schema`);
  });

  it(`formats VACUUM with just INTO`, () => {
    test(`VACUUM INTO 'my_file.sqlite'`);
  });
});
