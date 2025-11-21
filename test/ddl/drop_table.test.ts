import { test, testBigquery, testPostgresql } from "../test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, async () => {
    await test(`DROP TABLE client`);
  });

  it(`formats IF EXISTS`, async () => {
    await test(`DROP TABLE IF EXISTS schm.client`);
  });

  it(`formats DROP SNAPSHOT table`, async () => {
    await testBigquery(`DROP SNAPSHOT TABLE foo`);
  });

  it(`formats DROP EXTERNAL table`, async () => {
    await testBigquery(`DROP EXTERNAL TABLE foo`);
  });

  it(`formats multiple table names`, async () => {
    await testPostgresql(`DROP TABLE foo, bar, baz`);
  });

  it(`formats CASCADE|RESTRICT`, async () => {
    await testPostgresql(`DROP TABLE foo CASCADE`);
  });
});
