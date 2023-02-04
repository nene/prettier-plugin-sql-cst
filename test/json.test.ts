import dedent from "dedent-js";
import { pretty, test } from "./test_utils";

describe("json", () => {
  it(`formats JSON literals`, () => {
    test(
      dedent`
        SELECT JSON '{ "foo": true }'
      `,
      { dialect: "bigquery" }
    );
  });

  it(`formats JSON literal using Prettier JSON formatter`, () => {
    expect(
      pretty(`SELECT JSON '{"fname":"John","lname":"Doe","valid":true}'`, {
        dialect: "bigquery",
      })
    ).toBe(
      dedent`
        SELECT JSON '{ "fname": "John", "lname": "Doe", "valid": true }'
      `
    );
  });

  it(`formats long JSON literal using Prettier JSON formatter to multiple lines`, () => {
    expect(
      pretty(
        `SELECT JSON '{"firstName":"John","lastName":"Doe","inventory":["Pickaxe", "Compass", "Dirt"]}'`,
        { dialect: "bigquery" }
      )
    ).toBe(
      dedent`
        SELECT
          JSON '''
            {
              "firstName": "John",
              "lastName": "Doe",
              "inventory": ["Pickaxe", "Compass", "Dirt"]
            }
          '''
      `
    );
  });
});
