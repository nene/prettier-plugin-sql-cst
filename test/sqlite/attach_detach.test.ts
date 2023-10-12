import { test } from "../test_utils";

describe("attach/detach", () => {
  it(`formats ATTACH DATABASE statement`, async () => {
    test(`ATTACH DATABASE 'my_file.sqlite' AS my_schema`);
  });

  it(`formats plain ATTACH statement (without DATABASE keyword)`, async () => {
    test(`ATTACH 'my_file.sqlite' AS my_schema`);
  });

  it(`formats DETACH DATABASE statement`, async () => {
    test(`DETACH DATABASE my_schema`);
  });

  it(`formats plain DETACH statement (without DATABASE keyword)`, async () => {
    test(`DETACH my_schema`);
  });
});
