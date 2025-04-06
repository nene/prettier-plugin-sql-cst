import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("with sqlCanonicalSyntax enabled", () => {
  it(`converts implicit aliases to use AS keyword`, async () => {
    expect(
      await pretty(`SELECT 1 AS foo, 2 bar FROM client c, tbl AS t`, {
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      SELECT 1 AS foo, 2 AS bar
      FROM
        client AS c,
        tbl AS t
    `);
  });

  it(`replaces TEMP with TEMPORARY`, async () => {
    expect(
      await pretty(`CREATE TEMP TABLE foo (id INT)`, {
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      CREATE TEMPORARY TABLE foo (id INT)
    `);
  });

  it(`replaces DISTINCTROW with DISTINCT`, async () => {
    expect(
      await pretty(`SELECT DISTINCTROW foo FROM tbl`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      SELECT DISTINCT foo FROM tbl
    `);
  });

  it(`replaces RENAME with RENAME TO`, async () => {
    expect(
      await pretty(`ALTER TABLE foo RENAME bar`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      ALTER TABLE foo RENAME TO bar
    `);
  });

  it(`replaces RENAME AS with RENAME TO`, async () => {
    expect(
      await pretty(`ALTER TABLE foo RENAME AS bar`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      ALTER TABLE foo RENAME TO bar
    `);
  });

  it(`replaces INSERT with INSERT INTO`, async () => {
    expect(
      await pretty(`INSERT foo (id) VALUES (1)`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      INSERT INTO foo (id) VALUES (1)
    `);
  });

  it(`replaces REPLACE with REPLACE INTO`, async () => {
    expect(
      await pretty(`REPLACE foo (id) VALUES (1)`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      REPLACE INTO foo (id) VALUES (1)
    `);
  });

  it(`replaces MERGE with MERGE INTO`, async () => {
    expect(
      await pretty(`MERGE foo USING bar ON x = y WHEN MATCHED THEN DELETE`, {
        dialect: "bigquery",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      MERGE INTO foo
      USING bar
      ON x = y
      WHEN MATCHED THEN
        DELETE
    `);
  });

  it(`replaces DELETE with DELETE FROM`, async () => {
    expect(
      await pretty(`DELETE client WHERE id = 10`, {
        dialect: "bigquery",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      DELETE FROM client WHERE id = 10
    `);
  });

  it(`replaces TRUNCATE with TRUNCATE TABLE`, async () => {
    expect(
      await pretty(`TRUNCATE client`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(dedent`
      TRUNCATE TABLE client
    `);
  });

  it(`converts old PostgreSQL := syntax to standard => syntax for named arguments`, async () => {
    expect(
      await pretty(`SELECT my_func(foo := 'Hello', bar := 'World')`, {
        dialect: "postgresql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(`SELECT my_func(foo => 'Hello', bar => 'World')`);
  });

  it(`converts <> comparisons to !=`, async () => {
    expect(
      await pretty(`SELECT * FROM foo WHERE x <> 1 AND y <> 3`, {
        sqlCanonicalSyntax: true,
      }),
    ).toBe(`SELECT * FROM foo WHERE x != 1 AND y != 3`);
  });

  it(`converts MySQL && and || operators to AND and OR`, async () => {
    expect(
      await pretty(`SELECT a && b || c`, {
        dialect: "mysql",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(`SELECT a AND b OR c`);
  });
  it(`converts MariaDB && and || operators to AND and OR`, async () => {
    expect(
      await pretty(`SELECT a && b || c`, {
        dialect: "mariadb",
        sqlCanonicalSyntax: true,
      }),
    ).toBe(`SELECT a AND b OR c`);
  });
});
