import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("comment", () => {
  it(`formats short COMMENT ON`, async () => {
    await testPostgresql(dedent`
      COMMENT ON TABLE revenue IS 'Hello, world!'
    `);
  });

  it(`formats long COMMENT ON`, async () => {
    await testPostgresql(dedent`
      COMMENT ON CONSTRAINT constraint_name ON DOMAIN domain_name IS
        'This is a really nice comment here.'
    `);
  });

  it(`formats multi-line comment`, async () => {
    await testPostgresql(dedent`
      COMMENT ON TABLE foo IS
        'This is a multi-line comment,
        that spans several lines.
        In here.'
    `);
  });

  it(`formats long comment target`, async () => {
    await testPostgresql(dedent`
      COMMENT ON FUNCTION my_absolutely_fantastic_function(
        IN whoopsie CHARACTER VARYING,
        OUT doopsie TEXT
      ) IS
        'This is a really nice comment here.'
    `);
  });
});
