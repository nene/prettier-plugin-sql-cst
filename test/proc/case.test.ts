import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("case", () => {
  it(`formats procedural CASE`, async () => {
    await testBigquery(dedent`
      CASE foo
        WHEN 1 THEN
          SELECT CONCAT('Product one');
        ELSE
          SELECT CONCAT('Invalid product');
      END CASE
    `);
  });

  it(`breaks long WHEN/THEN clauses into separate lines`, async () => {
    await testBigquery(
      dedent`
        CASE foo
          WHEN
            column_name = 1
            AND (other_name = 2 OR other_name = 3)
          THEN
            SELECT CONCAT('Product one');
          ELSE
            SELECT CONCAT('Invalid product');
        END CASE
      `,
      { printWidth: 50 },
    );
  });
});
