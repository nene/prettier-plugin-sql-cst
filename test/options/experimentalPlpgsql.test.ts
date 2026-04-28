import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlExperimentalPlpgsql option", () => {
  describe("with sqlExperimentalPlpgsql disabled (the default)", () => {
    it(`keeps PL/pgSQL function body as-is`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE plpgsql
            AS $$BEGIN RETURN 1; END$$
          `,
          { dialect: "postgresql", sqlExperimentalPlpgsql: false },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE plpgsql
        AS $$BEGIN RETURN 1; END$$
      `);
    });
  });

  describe("with sqlExperimentalPlpgsql enabled", () => {
    it(`formats the PL/pgSQL function body`, async () => {
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
  });
});
