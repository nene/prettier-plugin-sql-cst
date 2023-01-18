import dedent from "dedent-js";
import { test } from "./test_utils";

describe("create table", () => {
  it(`formats CREATE TABLE always on multiple lines`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT NOT NULL,
        name VARCHAR(100),
        organization_id INT
      )
    `);
  });

  it(`formats CREATE TABLE with table constraints`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR,
        PRIMARY KEY (id, name),
        UNIQUE (name),
        CHECK (id > 0),
        FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `);
  });

  it(`formats CREATE TABLE with named table constraints`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT,
        CONSTRAINT prim_key PRIMARY KEY (id, name),
        CONSTRAINT org_for_key
          FOREIGN KEY (id, org_id) REFERENCES organization (id, org_id)
      )
    `);
  });
});
