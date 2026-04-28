import dedent from "dedent-js";
import { pretty, testBigquery } from "../test_utils";

describe("LANGUAGE js", () => {
  it(`formats JavaScript FUNCTION`, async () => {
    await testBigquery(dedent`
      CREATE FUNCTION gen_random()
      RETURNS FLOAT64
      NOT DETERMINISTIC
      LANGUAGE js
      AS r'''
        return Math.random();
      '''
    `);
  });

  it(`reformats JavaScript in JS function`, async () => {
    expect(
      await pretty(
        dedent`
          CREATE FUNCTION gen_random()
          RETURNS FLOAT64
          LANGUAGE js
          AS ' if(true) {return Math.random () *2}'
        `,
        { dialect: "bigquery" },
      ),
    ).toBe(dedent`
      CREATE FUNCTION gen_random()
      RETURNS FLOAT64
      LANGUAGE js
      AS r'''
        if (true) {
          return Math.random() * 2;
        }
      '''
    `);
  });

  it(`quotes JavaScript in double-quotes when single-quotes can't be used`, async () => {
    expect(
      await pretty(
        dedent`
          CREATE FUNCTION contains_quotes(x STRING)
          RETURNS FLOAT64
          LANGUAGE js
          AS " return /'''/.test(x) "
        `,
        { dialect: "bigquery" },
      ),
    ).toBe(dedent`
      CREATE FUNCTION contains_quotes(x STRING)
      RETURNS FLOAT64
      LANGUAGE js
      AS r"""
        return /'''/.test(x);
      """
    `);
  });

  it(`does not reformat JavaScript when neither ''' or """ can be easily used for quoting`, async () => {
    expect(
      await pretty(
        dedent`
          CREATE FUNCTION contains_quotes(x STRING)
          RETURNS FLOAT64
          LANGUAGE js
          AS " return /'''|\\"\\"\\"/.test(x) "
        `,
        { dialect: "bigquery" },
      ),
    ).toBe(dedent`
      CREATE FUNCTION contains_quotes(x STRING)
      RETURNS FLOAT64
      LANGUAGE js
      AS " return /'''|\\"\\"\\"/.test(x) "
    `);
  });
});
