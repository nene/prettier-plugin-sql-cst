import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

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

  it(`formats FOR .. IN`, async () => {
    await testBigquery(dedent`
      FOR record IN (SELECT * FROM tbl) DO
        SELECT record.foo, record.bar;
      END FOR
    `);
  });

  it(`formats BREAK/CONTINUE`, async () => {
    await testBigquery(dedent`
      LOOP
        IF TRUE THEN
          BREAK;
        ELSE
          CONTINUE;
        END IF;
      END LOOP
    `);
  });

  it(`formats labels`, async () => {
    await testBigquery(dedent`
      outer_loop: LOOP
        inner_loop: LOOP
          BREAK outer_loop;
        END LOOP;
      END LOOP
    `);
  });

  it(`formats end labels`, async () => {
    await testBigquery(dedent`
      outer_loop: REPEAT
        inner_loop: LOOP
          CONTINUE outer_loop;
        END LOOP inner_loop;
      UNTIL TRUE END REPEAT outer_loop
    `);
  });
});
