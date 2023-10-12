import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("if", () => {
  it(`formats IF .. THEN .. END IF`, async () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      END IF
    `);
  });

  it(`formats ELSE`, async () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      ELSE
        SELECT 2;
      END IF
    `);
  });

  it(`formats ELSEIF`, async () => {
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

  it(`formats IF with multiple statements inside`, async () => {
    testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
        SELECT 2;
        SELECT 3;
      END IF
    `);
  });

  it(`formats IF with long condition`, async () => {
    testBigquery(dedent`
      IF
        EXISTS (SELECT 1 FROM schema.products WHERE product_id = target_product_id)
        AND target_product_id IS NOT NULL
      THEN
        SELECT 1;
      END IF
    `);
  });

  it(`formats ELSEIF with long condition`, async () => {
    testBigquery(dedent`
      IF TRUE THEN
        SELECT 1;
      ELSEIF
        EXISTS (SELECT 1 FROM schema.products WHERE product_id = target_product_id)
        AND target_product_id IS NOT NULL
      THEN
        SELECT 2;
      END IF
    `);
  });
});
