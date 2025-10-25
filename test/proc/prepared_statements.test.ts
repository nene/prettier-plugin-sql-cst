import dedent from "dedent-js";
import { testBigquery, testMysql, testPostgresql } from "../test_utils";

describe("prepared statements", () => {
  it(`formats EXECUTE name`, async () => {
    await testPostgresql(dedent`
      EXECUTE my_prepared_stmt
    `);
  });

  it(`formats EXECUTE name(args)`, async () => {
    await testPostgresql(dedent`
      EXECUTE my_prepared_stmt(1, 'some text')
    `);
  });

  it(`formats EXECUTE name(...long argument list)`, async () => {
    await testPostgresql(dedent`
      EXECUTE my_prepared_stmt(
        1,
        'some text',
        3.14,
        TRUE,
        NULL,
        'another text',
        42,
        FALSE
      )
    `);
  });

  it(`formats EXECUTE name USING ...args`, async () => {
    await testMysql(dedent`
      EXECUTE my_prepared_stmt USING 1, 'some text'
    `);
  });

  it(`formats EXECUTE name USING ...long argument list`, async () => {
    await testMysql(dedent`
      EXECUTE my_prepared_stmt USING
        1,
        'some text',
        3.14,
        TRUE,
        NULL,
        'another text',
        42,
        FALSE
    `);
  });

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
