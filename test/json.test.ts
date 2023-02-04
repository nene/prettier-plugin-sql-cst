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

  it(`converts double-quoted JSON literal to single-quoted one`, () => {
    expect(
      pretty(String.raw`SELECT JSON "{\"name\":\"John Doe\"}"`, {
        dialect: "bigquery",
      })
    ).toBe(
      dedent`
        SELECT JSON '{ "name": "John Doe" }'
      `
    );
  });

  it(`converts triple-quoted JSON literal to single-quoted one when it fits to single line`, () => {
    expect(
      pretty(`SELECT JSON '''{"name":"John Doe"}'''`, {
        dialect: "bigquery",
      })
    ).toBe(
      dedent`
        SELECT JSON '{ "name": "John Doe" }'
      `
    );
  });

  it(`converts triple-dbl-quoted JSON literal to triple-single-quoted`, () => {
    expect(
      pretty(
        `SELECT JSON """{"firstName":"John","lastName":"Doe","inventory":["Pickaxe", "Compass", "Dirt"]}"""`,
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

  it(`always uses triple-quotes when JSON contains single quote character`, () => {
    expect(
      pretty(String.raw`SELECT JSON '{"name":"It\'s Mr John"}'`, {
        dialect: "bigquery",
      })
    ).toBe(
      dedent`
        SELECT JSON '''{ "name": "It's Mr John" }'''
      `
    );
  });

  // Just skip formatting in this tricky case for now
  it(`don't format JSON when it contains triple quotes`, () => {
    expect(
      pretty(String.raw`SELECT JSON '{"name":"It\'\'\'s Mr John"}'`, {
        dialect: "bigquery",
      })
    ).toBe(
      dedent`
        SELECT JSON '{"name":"It\\'\\'\\'s Mr John"}'
      `
    );
  });
});
