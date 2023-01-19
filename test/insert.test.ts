import dedent from "dedent-js";
import { test } from "./test_utils";

describe("insert", () => {
  it(`formats INSERT statement without column names`, () => {
    test(dedent`
      INSERT INTO client
      VALUES (1, 'John', 'Doe', 27)
    `);
  });

  it(`formats INSERT statement with column names`, () => {
    test(dedent`
      INSERT INTO client
        (id, fname, lname, org_id)
      VALUES (1, 'John', 'Doe', 27)
    `);
  });

  it(`formats INSERT statement with multiple rows always to multiple lines`, () => {
    test(dedent`
      INSERT INTO client
      VALUES
        (1, 'John', 'Doe', 27),
        (2, 'Alice', 'Namis', 31)
    `);
  });

  it(`formats INSERT statement with long column names list`, () => {
    test(dedent`
      INSERT INTO client
        (id, first_name, last_name, organization_id, project_access_enabled)
      VALUES
        (1, 'John', 'Doe', 27, TRUE),
        (2, 'Alice', 'Namis', 31, FALSE),
        (3, 'Peter', 'Tucker', 11, TRUE)
    `);
  });

  it(`formats INSERT statement with very long column names and values lists`, () => {
    test(dedent`
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
});
