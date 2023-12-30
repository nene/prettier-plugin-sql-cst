import dedent from "dedent-js";
import { test, testBigquery, testMysql } from "../test_utils";

describe("insert", () => {
  it(`formats INSERT statement without column names`, async () => {
    await test(dedent`
      INSERT INTO client
      VALUES
        (1, 'John', 'Doe', 27)
    `);
  });

  it(`formats INSERT statement without INTO`, async () => {
    await testBigquery(dedent`
      INSERT client
      VALUES
        (1, 2, 3)
    `);
  });

  it(`formats INSERT statement with column names`, async () => {
    await test(dedent`
      INSERT INTO client
        (id, fname, lname, org_id)
      VALUES
        (1, 'John', 'Doe', 27)
    `);
  });

  it(`formats INSERT statement with multiple rows always to multiple lines`, async () => {
    await test(dedent`
      INSERT INTO client
      VALUES
        (1, 'John', 'Doe', 27),
        (2, 'Alice', 'Namis', 31)
    `);
  });

  it(`formats INSERT statement with long column names list`, async () => {
    await test(dedent`
      INSERT INTO client
        (id, first_name, last_name, organization_id, project_access_enabled)
      VALUES
        (1, 'John', 'Doe', 27, TRUE),
        (2, 'Alice', 'Namis', 31, FALSE),
        (3, 'Peter', 'Tucker', 11, TRUE)
    `);
  });

  it(`formats INSERT statement with very long column names and values lists`, async () => {
    await test(dedent`
      INSERT INTO client
        (
          id,
          first_name,
          last_name,
          organization_id,
          project_access_enabled,
          delivery_status
        )
      VALUES
        (
          1,
          'Johnathan Sigfried Jr.',
          'Dolittle',
          2745612,
          TRUE,
          'permanently_disabled'
        ),
        (2, 'Alicia', 'Namis', 31, FALSE, 'allows_accepting')
    `);
  });

  it(`formats OR ABORT modifier`, async () => {
    await test(dedent`
      INSERT OR ABORT INTO employee
      VALUES
        (1, 2, 3)
    `);
  });

  it("formats insertion of DEFAULT VALUES", async () => {
    await test(dedent`
      INSERT INTO employee
      DEFAULT VALUES
    `);
  });

  it("formats DEFAULT values among normal values", async () => {
    await testBigquery(dedent`
      INSERT INTO employee
      VALUES
        (1, 2, DEFAULT, 3)
    `);
  });

  it("formats insertion of query", async () => {
    await test(dedent`
      INSERT INTO employee
      SELECT * FROM tbl
    `);
  });

  it("formats upsert clauses", async () => {
    await test(dedent`
      INSERT INTO client
      VALUES
        (1, 2, 3)
      ON CONFLICT DO NOTHING
      ON CONFLICT (name, price) DO NOTHING
      ON CONFLICT (id) WHERE id > 10 DO UPDATE
        SET id = uuid + 1
        WHERE id < 100
    `);
  });

  it(`formats INSERT with RETURNING clause`, async () => {
    await test(dedent`
      INSERT INTO client
      VALUES
        (1, 2, 3)
      RETURNING id, name, status
    `);
  });

  it(`formats INSERT with PARTITION clause`, async () => {
    await testMysql(dedent`
      INSERT INTO client
      PARTITION (p1, p2)
      VALUES
        (1, 2, 3)
    `);
  });

  it(`formats INSERT with ON DUPLICATE KEY UPDATE clause`, async () => {
    await testMysql(dedent`
      INSERT INTO client
      VALUES
        (1, 2, 3)
      ON DUPLICATE KEY UPDATE
        col1 = 2,
        col2 = DEFAULT
    `);
  });

  it(`formats INSERT with ON DUPLICATE KEY UPDATE and row alias`, async () => {
    await testMysql(dedent`
      INSERT INTO client
      VALUES
        (1, 'John')
      AS new_row
      ON DUPLICATE KEY UPDATE
        id = new_row.id + 1
    `);
  });

  it(`formats INSERT with ON DUPLICATE KEY UPDATE and row alias (column aliases)`, async () => {
    await testMysql(dedent`
      INSERT INTO client
      VALUES
        (1, 'John')
      AS new_row
        (id, fname)
      ON DUPLICATE KEY UPDATE
        id = new_row.id + 1
    `);
  });
});
