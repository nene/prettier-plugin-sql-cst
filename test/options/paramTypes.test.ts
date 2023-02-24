import { pretty, test } from "../test_utils";

describe("sqlParamTypes option", () => {
  it(`by default bound parameters are not supported`, () => {
    expect(() => pretty(`SELECT * FROM tbl WHERE x = ?`)).toThrowError();
  });

  it(`positional parameters: ?`, () => {
    test(`SELECT * FROM tbl WHERE x = ? AND y = ?`, {
      sqlParamTypes: ["?"],
    });
  });

  it(`indexed parameters: ?nr`, () => {
    test(`SELECT * FROM tbl WHERE x = ?1 AND y = ?2`, {
      sqlParamTypes: ["?nr"],
    });
  });

  it(`named parameters: :name`, () => {
    test(`SELECT * FROM tbl WHERE x = :foo AND y = :bar`, {
      sqlParamTypes: [":name"],
    });
  });

  it(`mix of different parameter types`, () => {
    test(`SELECT * FROM tbl WHERE x = @foo AND y = $bar`, {
      sqlParamTypes: ["@name", "$name"],
    });
  });
});
