import { testBigquery } from "../test_utils";

describe("truncate", () => {
  it(`formats TRUNCATE TABLE statement`, async () => {
    testBigquery(`TRUNCATE TABLE dataset.employee`);
  });
});
