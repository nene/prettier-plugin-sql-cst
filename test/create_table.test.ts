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

  it(`formats CREATE TABLE with table constraints`, () => {
    const sql = dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR,
        PRIMARY KEY (id, name),
        UNIQUE (name),
        CHECK (id > 0),
        FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `;
    expect(pretty(sql)).toBe(sql);
  });

  it(`formats CREATE TABLE with named table constraints`, () => {
    const sql = dedent`
      CREATE TABLE client (
        id INT,
        CONSTRAINT prim_key PRIMARY KEY (id, name),
        CONSTRAINT org_for_key
          FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `;
    expect(pretty(sql)).toBe(sql);
  });
});
