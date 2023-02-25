import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("loops", () => {
  it(`formats LOOP`, () => {
    testBigquery(dedent`
      LOOP
        SELECT 1;
      END LOOP
    `);
  });

  it(`formats REPEAT`, () => {
    testBigquery(dedent`
      REPEAT
        SET x = x + 1;
      UNTIL x > 10 END REPEAT
    `);
  });

  it(`formats WHILE`, () => {
    testBigquery(dedent`
      WHILE x < 10 DO
        SET x = x + 1;
      END WHILE
    `);
  });

  it(`formats FOR .. IN`, () => {
    testBigquery(dedent`
      FOR record IN (SELECT * FROM tbl) DO
        SELECT record.foo, record.bar;
      END FOR
    `);
  });

  it(`formats BREAK/CONTINUE`, () => {
    testBigquery(dedent`
      LOOP
        IF TRUE THEN
          BREAK;
        ELSE
          CONTINUE;
        END IF;
      END LOOP
    `);
  });
});
