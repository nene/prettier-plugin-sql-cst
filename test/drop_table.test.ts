import dedent from "dedent-js";
import { test } from "./test_utils";

describe("drop table", () => {
  it(`formats DROP TABLE statement`, () => {
    test(dedent`
      DROP TABLE client
    `);
  });

  it(`formats IF EXISTS`, () => {
    test(dedent`
      DROP TABLE IF EXISTS schm.client
    `);
  });
});
