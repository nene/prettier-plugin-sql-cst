import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("merge", () => {
  it(`formats MERGE .. DELETE`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO dataset.DetailedInventory AS target
        USING dataset.Inventory AS source
        ON target.product = source.product
        WHEN MATCHED THEN
          DELETE
      `,
    );
  });

  it(`formats MERGE .. INSERT (cols) VALUES`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN NOT MATCHED AND quantity < 10 THEN
          INSERT
            (product, quantity, supply_constrained, comments)
          VALUES
            (product, quantity, TRUE, 'My comment')
      `,
    );
  });

  it(`formats MERGE .. INSERT VALUES`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT
          VALUES
            (col1, DEFAULT, col2)
      `,
    );
  });

  it(`formats MERGE .. INSERT ROW`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT ROW
      `,
    );
  });

  it(`formats MERGE .. INSERT (columns) ROW`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT
            (col1, col2, col3)
          ROW
      `,
    );
  });

  it(`formats MERGE .. UPDATE`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN NOT MATCHED BY SOURCE THEN
          UPDATE SET
            quantity = 1,
            supply_constrained = FALSE,
            comments = ''
      `,
    );
  });

  it(`formats MERGE .. UPDATE with single-element update`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN NOT MATCHED BY SOURCE THEN
          UPDATE SET quantity = 1
      `,
    );
  });

  it(`formats long ON-condition`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON
          target.id = source.id
          AND source.quantity > target.quantity
          AND quantity > 1000
        WHEN MATCHED THEN
          DELETE
      `,
    );
  });

  it(`formats long WHEN-condition`, async () => {
    await testBigquery(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN NOT MATCHED BY SOURCE
          AND source.quantity > target.quantity
          OR source.quantity < 0
          OR target.id = 18967
        THEN
          UPDATE SET quantity = 1
      `,
    );
  });
});
