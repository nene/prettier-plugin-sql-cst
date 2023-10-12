import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("set", () => {
  it(`formats basic SET statement`, async () => {
    testBigquery(dedent`
      SET x = 1
    `);
  });

  it(`formats multi-assignment SET`, async () => {
    testBigquery(dedent`
      SET (x, y, z) = (1, 2, 3)
    `);
  });

  it(`formats long SET expressions`, async () => {
    testBigquery(dedent`
      SET (first_variable, second_variable) = (
        FORMAT('%d', word_count),
        FORMAT('%d', line_count)
      )
    `);
  });

  it(`formats long SET variable list`, async () => {
    testBigquery(dedent`
      SET (
        first_variable,
        second_variable,
        third_variable,
        fourth_variable,
        final_variable
      ) = (1, 2, 3, 4)
    `);
  });
});
