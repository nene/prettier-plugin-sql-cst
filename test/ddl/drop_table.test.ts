import { test, testBigquery } from "../test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, async () => {
    test(`DROP TABLE client`);
  });

  it(`formats IF EXISTS`, async () => {
    test(`DROP TABLE IF EXISTS schm.client`);
  });

  it(`formats DROP SNAPSHOT table`, async () => {
    testBigquery(`DROP SNAPSHOT TABLE foo`);
  });

  it(`formats DROP EXTERNAL table`, async () => {
    testBigquery(`DROP EXTERNAL TABLE foo`);
  });
});
