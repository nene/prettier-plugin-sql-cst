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

  it(`formats PREPARE name AS statement`, async () => {
    await testPostgresql(dedent`
      PREPARE my_statement AS
        SELECT 1, 2, 3
    `);
  });

  it(`formats PREPARE name (...params)`, async () => {
    await testPostgresql(
      dedent`
      PREPARE my_statement(INT, TEXT, TIMESTAMP) AS
        SELECT $1, $2, $3
    `,
      { sqlParamTypes: ["$nr"] },
    );
  });

  it(`formats PREPARE name (...long parameter list)`, async () => {
    await testPostgresql(
      dedent`
      PREPARE my_statement(
        INTEGER,
        VARCHAR(200),
        BOOLEAN,
        TIMESTAMP WITH TIME ZONE
      ) AS
        SELECT $1, $2, $3, $4
    `,
      { sqlParamTypes: ["$nr"] },
    );
  });

  it(`formats PREPARE name FROM @var`, async () => {
    await testMysql(dedent`
      PREPARE my_statement FROM @var
    `);
  });

  it(`formats PREPARE name FROM 'long string'`, async () => {
    await testMysql(dedent`
      PREPARE my_statement FROM
        'SELECT 1 AS col1, 2 AS col2, 3 AS col3, 4 AS col4, 5 AS col5'
    `);
  });

  it(`formats DEALLOCATE PREPARE name`, async () => {
    await testPostgresql(dedent`
      DEALLOCATE PREPARE my_statement
    `);
  });

  it(`formats DEALLOCATE ALL`, async () => {
    await testPostgresql(dedent`
      DEALLOCATE ALL
    `);
  });
});
