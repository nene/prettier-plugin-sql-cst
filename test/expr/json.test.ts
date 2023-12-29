import dedent from "dedent-js";
import { pretty, testBigquery } from "../test_utils";

describe("json", () => {
  it(`formats JSON literals`, async () => {
    await testBigquery(
      dedent`
        SELECT JSON '{ "foo": true }'
      `,
    );
  });

  it(`formats JSON literal using Prettier JSON formatter`, async () => {
    expect(
      await pretty(
        `SELECT JSON '{"fname":"John","lname":"Doe","valid":true}'`,
        {
          dialect: "bigquery",
        },
      ),
    ).toBe(
      dedent`
        SELECT JSON '{ "fname": "John", "lname": "Doe", "valid": true }'
      `,
    );
  });

  it(`formats long JSON literal using Prettier JSON formatter to multiple lines`, async () => {
    expect(
      await pretty(
        `SELECT JSON '{"firstName":"John","lastName":"Doe","inventory":["Pickaxe", "Compass", "Dirt"]}'`,
        { dialect: "bigquery" },
      ),
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
      `,
    );
  });

  it(`converts double-quoted JSON literal to single-quoted one`, async () => {
    expect(
      await pretty(String.raw`SELECT JSON "{\"name\":\"John Doe\"}"`, {
        dialect: "bigquery",
      }),
    ).toBe(
      dedent`
        SELECT JSON '{ "name": "John Doe" }'
      `,
    );
  });

  it(`converts triple-quoted JSON literal to single-quoted one when it fits to single line`, async () => {
    expect(
      await pretty(`SELECT JSON '''{"name":"John Doe"}'''`, {
        dialect: "bigquery",
      }),
    ).toBe(
      dedent`
        SELECT JSON '{ "name": "John Doe" }'
      `,
    );
  });

  it(`converts triple-dbl-quoted JSON literal to triple-single-quoted`, async () => {
    expect(
      await pretty(
        `SELECT JSON """{"firstName":"John","lastName":"Doe","inventory":["Pickaxe", "Compass", "Dirt"]}"""`,
        { dialect: "bigquery" },
      ),
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
      `,
    );
  });

  it(`always uses triple-quotes when JSON contains single quote character`, async () => {
    expect(
      await pretty(String.raw`SELECT JSON '{"name":"It\'s Mr John"}'`, {
        dialect: "bigquery",
      }),
    ).toBe(
      dedent`
        SELECT JSON '''{ "name": "It's Mr John" }'''
      `,
    );
  });

  // Just skip formatting in this tricky case for now
  it(`doesn't format JSON when it contains triple quotes`, async () => {
    expect(
      await pretty(String.raw`SELECT JSON '{"name":"It\'\'\'s Mr John"}'`, {
        dialect: "bigquery",
      }),
    ).toBe(
      dedent`
        SELECT JSON '{"name":"It\\'\\'\\'s Mr John"}'
      `,
    );
  });

  // Also skip dealing with escapes for now
  it(`doesn't format JSON when it contains escape sequences`, async () => {
    await testBigquery(String.raw`SELECT JSON '{ "name": "\\n" }'`);
  });

  // Also skip dealing with raw strings
  it(`doesn't format JSON inside raw strings`, async () => {
    await testBigquery(`SELECT JSON r'{"name":"John"}'`);
  });
});
