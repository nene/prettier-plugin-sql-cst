import { test } from "./test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, () => {
    test(`DROP TABLE client`);
  });

  it(`formats IF EXISTS`, () => {
    test(`DROP TABLE IF EXISTS schm.client`);
  });

  it.skip(`formats DROP SNAPSHOT table`, () => {
    test(`DROP SNAPSHOT TABLE foo`, { dialect: "bigquery" });
  });

  it.skip(`formats DROP EXTERNAL table`, () => {
    test(`DROP EXTERNAL TABLE foo`, { dialect: "bigquery" });
  });
});
