import dedent from "dedent-js";
import { pretty } from "./test_utils";

describe("create table", () => {
  it(`formats CREATE TABLE always on multiple lines`, () => {
    expect(
      pretty(
        `CREATE TABLE client (id INT NOT NULL, name VARCHAR(100), organization_id INT)`
      )
    ).toBe(dedent`
      CREATE TABLE client (
        id INT NOT NULL,
        name VARCHAR(100),
        organization_id INT
      )
    `);
  });
});
