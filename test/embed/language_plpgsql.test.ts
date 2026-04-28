import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("LANGUAGE plpgsql", () => {
  describe("CREATE FUNCTION", () => {
    it(`reformats SQL in dollar-quoted PL/pgSQL function`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE plpgsql
            AS $$BEGIN RETURN 1; END$$
          `,
          { dialect: "postgresql", sqlExperimentalPlpgsql: true },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN 1;
        END;
        $$
      `);
    });

    it(`ignores plpgsql language name case`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE "plPgSQL"
            AS $$BEGIN RETURN 1; END$$
          `,
          { dialect: "postgresql", sqlExperimentalPlpgsql: true },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE "plPgSQL"
        AS $$
        BEGIN
          RETURN 1;
        END;
        $$
      `);
    });
  });
});
