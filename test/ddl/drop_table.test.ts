import { test, testBigquery } from "../test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, () => {
    test(`DROP TABLE client`);
  });

  it(`formats IF EXISTS`, () => {
    test(`DROP TABLE IF EXISTS schm.client`);
  });

  it(`formats DROP SNAPSHOT table`, () => {
    testBigquery(`DROP SNAPSHOT TABLE foo`);
  });

  it(`formats DROP EXTERNAL table`, () => {
    testBigquery(`DROP EXTERNAL TABLE foo`);
  });
});
