import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("prepared statements", () => {
  it(`formats EXECUTE IMMEDIATE`, async () => {
    await testBigquery(dedent`
      EXECUTE IMMEDIATE 'SELECT * FROM tbl'
    `);
  });

  it(`formats EXECUTE IMMEDIATE with INTO and USING`, async () => {
    await testBigquery(dedent`
      EXECUTE IMMEDIATE 'SELECT ? + ?'
      INTO sum
      USING 1, 2
    `);
  });

  it(`formats EXECUTE IMMEDIATE with long query`, async () => {
    await testBigquery(dedent`
      EXECUTE IMMEDIATE
        'SELECT count(*) FROM myschema.mytable WHERE operations > 10 AND name IS NOT NULL'
      INTO cnt
    `);
  });
});
