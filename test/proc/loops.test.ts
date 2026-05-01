import dedent from "dedent-js";
import { testBigquery, testPlpgsql } from "../test_utils";

describe("loops", () => {
  it(`formats LOOP`, async () => {
    await testBigquery(dedent`
      LOOP
        SELECT 1;
      END LOOP
    `);
  });

  it(`formats REPEAT`, async () => {
    await testBigquery(dedent`
      REPEAT
        SET x = x + 1;
      UNTIL x > 10 END REPEAT
    `);
  });

  it(`formats WHILE`, async () => {
    await testBigquery(dedent`
      WHILE x < 10 DO
        SET x = x + 1;
      END WHILE
    `);
  });

  it(`formats WHILE .. LOOP .. END LOOP`, async () => {
    await testPlpgsql(dedent`
      WHILE x < 10 LOOP
        x = x + 1;
      END LOOP
    `);
  });

  it(`formats FOR .. IN`, async () => {
    await testBigquery(dedent`
      FOR record IN (SELECT * FROM tbl) DO
        SELECT record.foo, record.bar;
      END FOR
    `);
  });

  it(`formats FOR .. IN range LOOP`, async () => {
    await testPlpgsql(dedent`
      FOR n IN 1..10 LOOP
        x = x + n;
      END LOOP
    `);
  });

  it(`formats FOR .. IN REVERSE range LOOP`, async () => {
    await testPlpgsql(dedent`
      FOR n IN REVERSE 10..1 LOOP
        x = x + n;
      END LOOP
    `);
  });

  it(`formats FOR .. IN range BY step LOOP`, async () => {
    await testPlpgsql(dedent`
      FOR n IN x..y BY z LOOP
        x = x + n;
      END LOOP
    `);
  });

  it(`formats FOR .. IN query LOOP`, async () => {
    await testPlpgsql(dedent`
      FOR n IN SELECT num FROM nums LOOP
        x = x + n;
      END LOOP
    `);
  });
});
