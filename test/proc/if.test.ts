import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("if", () => {
  it(`formats IF .. THEN .. END IF`, () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      END IF
    `);
  });

  it(`formats ELSE`, () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      ELSE
        SELECT 2;
      END IF
    `);
  });

  it(`formats ELSEIF`, () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      ELSEIF x > 1 THEN
        SELECT 2;
      ELSEIF x < 1 THEN
        SELECT 3;
      ELSE
        SELECT 4;
      END IF
    `);
  });

  it(`formats IF with multiple statements inside`, () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;

        SELECT 2;

        SELECT 3;
      END IF
    `);
  });
});
