import dedent from "dedent-js";
import { testBigquery, testPlpgsql } from "../test_utils";

describe("raise", () => {
  it(`formats RAISE statement`, async () => {
    await testBigquery(dedent`
      RAISE
    `);
  });

  it(`formats RAISE with message`, async () => {
    await testBigquery(dedent`
      RAISE USING MESSAGE = 'Serious error!'
    `);
  });

  it(`formats RAISE with condition name`, async () => {
    await testPlpgsql(dedent`
      RAISE division_by_zero
    `);
  });

  it(`formats RAISE with SQLSTATE`, async () => {
    await testPlpgsql(dedent`
      RAISE SQLSTATE 'P0001'
    `);
  });

  it(`formats RAISE with level and USING clause`, async () => {
    await testPlpgsql(dedent`
      RAISE WARNING index_out_of_range
        USING MESSAGE = 'Index is out of range', HINT = 'Whatever'
    `);
  });

  it(`formats RAISE with long USING clause`, async () => {
    await testPlpgsql(dedent`
      RAISE index_out_of_range
        USING
          MESSAGE = 'Index is out of range',
          HINT = 'Please check the index and try again',
          DETAIL = 'The index you provided is 10, but the maximum allowed is 5'
    `);
  });

  it(`formats RAISE with plain string`, async () => {
    await testPlpgsql(dedent`
      RAISE 'An error occurred while processing your request'
    `);
  });

  it(`formats RAISE format string`, async () => {
    await testPlpgsql(dedent`
      RAISE 'Index % is out of range in %', idx, array_name
    `);
  });

  it(`formats RAISE format string with long arguments`, async () => {
    await testPlpgsql(dedent`
      RAISE 'Index % is out of range in %. %',
        idx,
        array_name,
        'Please check the index and try again'
    `);
  });
});
