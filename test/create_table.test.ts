import dedent from "dedent-js";
import { test } from "./test_utils";

describe("create table", () => {
  it(`formats CREATE TABLE always on multiple lines`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT,
        name VARCHAR(100),
        org_id INT
      )
    `);
  });

  it(`formats CREATE TABLE with column constraints`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT NOT NULL PRIMARY KEY,
        name VARCHAR(100) UNIQUE COLLATE RTRIM,
        age VARCHAR(6) DEFAULT 0,
        organization_id INT REFERENCES organization (id),
        byear1 INT GENERATED ALWAYS AS (today - age) VIRTUAL,
        byear2 INT AS (today - age)
      )
    `);
  });

  it(`formats SQLite PRIMARY KEY modifiers`, () => {
    test(dedent`
      CREATE TABLE client (
        id INTEGER PRIMARY KEY ASC AUTOINCREMENT
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

  it(`formats CREATE TABLE with named column constraints`, () => {
    test(dedent`
      CREATE TABLE client (
        id INT CONSTRAINT NOT NULL CONSTRAINT prim_key PRIMARY KEY
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
