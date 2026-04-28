import dedent from "dedent-js";
import { pretty } from "../test_utils";

const statements = [
  { name: "CREATE FUNCTION", code: "CREATE FUNCTION my_func()\nRETURNS INT" },
  { name: "CREATE PROCEDURE", code: "CREATE PROCEDURE my_proc()" },
];

describe("LANGUAGE plpgsql", () => {
  statements.forEach(({ name, code }) => {
    describe(name, () => {
      it(`reformats SQL in dollar-quoted PL/pgSQL function`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE plpgsql
              AS $$BEGIN RETURN 1; END$$
            `,
            { dialect: "postgresql", sqlExperimentalPlpgsql: true },
          ),
        ).toBe(dedent`
          ${code}
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
              ${code}
              LANGUAGE "plPgSQL"
              AS $$BEGIN RETURN 1; END$$
            `,
            { dialect: "postgresql", sqlExperimentalPlpgsql: true },
          ),
        ).toBe(dedent`
          ${code}
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
});
