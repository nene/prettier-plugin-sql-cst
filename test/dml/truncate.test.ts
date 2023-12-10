import { testBigquery } from "../test_utils";

describe("truncate", () => {
  it(`formats TRUNCATE TABLE statement`, async () => {
    await testBigquery(`TRUNCATE TABLE dataset.employee`);
  });
});
