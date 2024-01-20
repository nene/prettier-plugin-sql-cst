import dedent from "dedent-js";
import { test, testBigquery, testMysql, testPostgresql } from "../test_utils";

describe("insert", () => {
  it(`formats short INSERT statement on single line`, async () => {
    await test(dedent`
      INSERT INTO client VALUES (1, 'John', 'Doe', 27)
    `);
  });

  it(`formats INSERT statement without INTO`, async () => {
    await testBigquery(dedent`
      INSERT client VALUES (1, 2, 3)
    `);
  });

  it(`preserves short multi-line INSERT statement on multiple lines`, async () => {
    await testBigquery(dedent`
      INSERT INTO client
      VALUES (1, 2, 3)
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

  it(`preserves indentation preference of column names and values`, async () => {
    await testBigquery(dedent`
      INSERT INTO client (id, fname, lname, org_id)
      VALUES (1, 'John', 'Doe', 27)
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
      VALUES (1, 2, 3)
    `);
  });

  it(`formats INSERT with MySQL hints`, async () => {
    await testMysql(dedent`
      INSERT LOW_PRIORITY IGNORE INTO employee
      VALUES (1, 2, 3)
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
      VALUES (1, 2, DEFAULT, 3)
    `);
  });

  it("formats insertion of query", async () => {
    await test(dedent`
      INSERT INTO employee
      SELECT * FROM tbl
    `);
  });

  describe("upsert", () => {
    it("formats upsert clauses", async () => {
      await test(dedent`
        INSERT INTO client
        VALUES (1, 2, 3)
        ON CONFLICT DO NOTHING
        ON CONFLICT (name, price) DO NOTHING
        ON CONFLICT (id) WHERE id > 10 DO UPDATE
          SET id = uuid + 1
          WHERE id < 100
      `);
    });

    it("formats short DO UPDATE on a single line (if user prefers)", async () => {
      await test(dedent`
        INSERT INTO client
        VALUES (1, 2, 3)
        ON CONFLICT (id) DO UPDATE SET id = uuid + 1
      `);
    });

    it("formats upsert clause with ON CONSTRAINT", async () => {
      await testPostgresql(dedent`
        INSERT INTO client
        VALUES (1, 2, 3)
        ON CONFLICT ON CONSTRAINT client_pkey DO NOTHING
      `);
    });
  });

  describe("on duplicate key update", () => {
    it(`formats single-line (if user prefers)`, async () => {
      await testMysql(dedent`
        INSERT INTO client
        VALUES (1, 2, 3)
        ON DUPLICATE KEY UPDATE col1 = 2, col2 = DEFAULT
      `);
    });

    it(`formats multi-line (if user prefers)`, async () => {
      await testMysql(dedent`
        INSERT INTO client
        VALUES (1, 2, 3)
        ON DUPLICATE KEY UPDATE
          col1 = 2,
          col2 = DEFAULT
      `);
    });

    it(`formats with simple row alias`, async () => {
      await testMysql(dedent`
        INSERT INTO client
        VALUES (1, 'John')
        AS new_row
        ON DUPLICATE KEY UPDATE
          id = new_row.id + 1
      `);
    });

    it(`formats with row alias using column aliases`, async () => {
      await testMysql(dedent`
        INSERT INTO client
        VALUES (1, 'John')
        AS new_row
          (id, fname)
        ON DUPLICATE KEY UPDATE
          id = new_row.id + 1
      `);
    });

    it(`formats with row alias + column aliases on a single line`, async () => {
      await testMysql(dedent`
        INSERT INTO client
        VALUES (1, 'John')
        AS new_row (id, fname)
        ON DUPLICATE KEY UPDATE id = new_row.id + 1
      `);
    });
  });

  it(`formats INSERT with RETURNING clause`, async () => {
    await test(dedent`
      INSERT INTO client
      VALUES (1, 2, 3)
      RETURNING id, name, status
    `);
  });

  it(`formats INSERT with PARTITION selection`, async () => {
    await testMysql(dedent`
      INSERT INTO client PARTITION (p1, p2)
      VALUES (1, 2, 3)
    `);
  });

  it(`formats INSERT with OVERRIDING clause`, async () => {
    await testPostgresql(dedent`
      INSERT INTO client
      OVERRIDING SYSTEM VALUE
      VALUES (1, 'John')
    `);
  });
});
