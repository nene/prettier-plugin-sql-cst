import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("if", () => {
  it(`formats IF .. THEN .. END IF`, async () => {
    await testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      END IF
    `);
  });

  it(`formats ELSE`, async () => {
    await testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
      ELSE
        SELECT 2;
      END IF
    `);
  });

  it(`formats ELSEIF`, async () => {
    await testBigquery(dedent`
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
    await testBigquery(dedent`
      IF x > 10 THEN
        SELECT 1;
        SELECT 2;
        SELECT 3;
      END IF
    `);
  });

  it(`formats IF with long condition`, async () => {
    await testBigquery(dedent`
      IF
        EXISTS (SELECT 1 FROM schema.products WHERE product_id = target_product_id)
        AND target_product_id IS NOT NULL
      THEN
        SELECT 1;
      END IF
    `);
  });

  it(`formats ELSEIF with long condition`, async () => {
    await testBigquery(dedent`
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
