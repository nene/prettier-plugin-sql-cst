import dedent from "dedent-js";
import { test } from "../test_utils";

describe("merge", () => {
  it(`formats MERGE .. DELETE`, () => {
    test(
      dedent`
        MERGE INTO dataset.DetailedInventory AS target
        USING dataset.Inventory AS source
        ON target.product = source.product
        WHEN MATCHED THEN
          DELETE
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. INSERT (cols) VALUES`, () => {
    test(
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
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. INSERT VALUES`, () => {
    test(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT
          VALUES
            (col1, DEFAULT, col2)
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. INSERT ROW`, () => {
    test(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT ROW
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. INSERT (columns) ROW`, () => {
    test(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN MATCHED THEN
          INSERT
            (col1, col2, col3)
          ROW
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. UPDATE`, () => {
    test(
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
      { dialect: "bigquery" }
    );
  });

  it(`formats MERGE .. UPDATE with single-element update`, () => {
    test(
      dedent`
        MERGE INTO target
        USING source
        ON target.id = source.id
        WHEN NOT MATCHED BY SOURCE THEN
          UPDATE SET quantity = 1
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats long ON-condition`, () => {
    test(
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
      { dialect: "bigquery" }
    );
  });

  it(`formats long WHEN-condition`, () => {
    test(
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
      { dialect: "bigquery" }
    );
  });
});
