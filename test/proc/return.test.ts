import dedent from "dedent-js";
import { testBigquery, testMysql, testPlpgsql } from "../test_utils";

describe("return", () => {
  it(`formats RETURN statement`, async () => {
    await testBigquery(dedent`
      RETURN
    `);
  });

  it(`formats RETURN statement with value`, async () => {
    await testMysql(dedent`
      RETURN 5 + 6
    `);
  });

  it(`formats RETURN NEXT`, async () => {
    await testPlpgsql(dedent`
      RETURN NEXT foo
    `);
  });

  it(`formats long RETURN NEXT`, async () => {
    await testPlpgsql(dedent`
      RETURN NEXT my_function_call(
        'some long argument',
        'another one even longer',
        'and some more'
      )
    `);
  });

  it(`formats RETURN QUERY`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY SELECT * FROM tbl
    `);
  });

  it(`formats long RETURN QUERY`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY SELECT id, name, code, price, currency
        FROM products
        WHERE price > 10 AND currency = 'EUR'
    `);
  });

  it(`formats extra long RETURN QUERY`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY SELECT
          id,
          name,
          code,
          unit,
          unit_price,
          price,
          currency,
          is_on_sale
        FROM products
        WHERE price > 10 AND currency = 'EUR'
    `);
  });

  it(`formats RETURN QUERY EXECUTE`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY EXECUTE 'SELECT * FROM products WHERE id IN (?, ?)' USING 153, 82
    `);
  });

  it(`formats RETURN QUERY EXECUTE with long query string`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY EXECUTE
        'SELECT id, brand_name, product_name, price FROM products WHERE brand_name = ? OR product_name = ?'
        USING 'Macchiato madness', 'Espresso machine'
    `);
  });

  it(`formats RETURN QUERY EXECUTE with long USING clause`, async () => {
    await testPlpgsql(dedent`
      RETURN QUERY EXECUTE
        'SELECT * FROM products WHERE name IN (?, ?, ?, ?, ?)'
        USING
          '3000W Blender',
          'Espresso machine',
          'Air fryer',
          'Microwave oven',
          'Slow cooker'
    `);
  });
});
