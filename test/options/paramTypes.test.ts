import { pretty, test } from "../test_utils";

describe("sqlParamTypes option", () => {
  it(`by default bound parameters are not supported`, async () => {
    expect(() => pretty(`SELECT * FROM tbl WHERE x = ?`)).toThrowError();
  });

  it(`positional parameters: ?`, async () => {
    test(`SELECT * FROM tbl WHERE x = ? AND y = ?`, {
      sqlParamTypes: ["?"],
    });
  });

  it(`indexed parameters: ?nr`, async () => {
    test(`SELECT * FROM tbl WHERE x = ?1 AND y = ?2`, {
      sqlParamTypes: ["?nr"],
    });
  });

  it(`named parameters: :name`, async () => {
    test(`SELECT * FROM tbl WHERE x = :foo AND y = :bar`, {
      sqlParamTypes: [":name"],
    });
  });

  it(`mix of different parameter types`, async () => {
    test(`SELECT * FROM tbl WHERE x = @foo AND y = $bar`, {
      sqlParamTypes: ["@name", "$name"],
    });
  });
});
