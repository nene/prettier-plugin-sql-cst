import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("parameters", () => {
  it(`formats SET statement`, async () => {
    await testPostgresql(dedent`
      SET work_mem TO '64MB'
    `);
  });

  it(`formats SET [LOCAL] statement`, async () => {
    await testPostgresql(dedent`
      SET LOCAL max_connections = 200
    `);
  });

  it(`formats SET with ON/OFF values`, async () => {
    await testPostgresql(dedent`
      SET log_statement TO ON
    `);
    await testPostgresql(dedent`
      SET log_statement = OFF
    `);
  });

  it(`formats SET TIME ZONE statement`, async () => {
    await testPostgresql(dedent`
      SET TIME ZONE 'UTC'
    `);
  });

  it(`formats SET [SESSION] TIME ZONE LOCAL`, async () => {
    await testPostgresql(dedent`
      SET SESSION TIME ZONE LOCAL
    `);
  });

  it(`formats RESET statement`, async () => {
    await testPostgresql(dedent`
      RESET work_mem
    `);
  });

  it(`formats RESET ALL`, async () => {
    await testPostgresql(dedent`
      RESET ALL
    `);
  });

  it(`formats SHOW statement`, async () => {
    await testPostgresql(dedent`
      SHOW work_mem
    `);
  });

  it(`formats SHOW ALL`, async () => {
    await testPostgresql(dedent`
      SHOW ALL
    `);
  });
});
