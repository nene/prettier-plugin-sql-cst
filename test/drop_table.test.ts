import { test } from "./test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, () => {
    test(`DROP TABLE client`);
  });

  it(`formats IF EXISTS`, () => {
    test(`DROP TABLE IF EXISTS schm.client`);
  });

  it(`formats DROP SNAPSHOT table`, () => {
    test(`DROP SNAPSHOT TABLE foo`, { dialect: "bigquery" });
  });

  it(`formats DROP EXTERNAL table`, () => {
    test(`DROP EXTERNAL TABLE foo`, { dialect: "bigquery" });
  });
});
