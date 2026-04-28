import dedent from "dedent-js";
import { pretty } from "../test_utils";

const statements = [
  { name: "CREATE FUNCTION", code: "CREATE FUNCTION my_func()\nRETURNS INT" },
  { name: "CREATE PROCEDURE", code: "CREATE PROCEDURE my_proc()" },
];

describe("LANGUAGE plpgsql", () => {
  statements.forEach(({ name, code }) => {
    describe(name, () => {
      it(`reformats SQL in dollar-quoted string`, async () => {
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

      it(`converts single-quoted string to dollar-quoted string`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE plpgsql
              AS 'BEGIN SELECT ''foo''; END'
            `,
            { dialect: "postgresql", sqlExperimentalPlpgsql: true },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE plpgsql
          AS $$
          BEGIN
            SELECT 'foo';
          END;
          $$
        `);
      });

      it(`does not reformat single-quoted SQL string when its source contains $$-quotes`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE plpgsql
              AS 'BEGIN SELECT $$foo$$; END'
            `,
            { dialect: "postgresql", sqlExperimentalPlpgsql: true },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE plpgsql
          AS 'BEGIN SELECT $$foo$$; END'
        `);
      });

      it(`does not reformat E'quoted' strings`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE plpgsql
              AS E'BEGIN SELECT 1; END'
            `,
            { dialect: "postgresql", sqlExperimentalPlpgsql: true },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE plpgsql
          AS E'BEGIN SELECT 1; END'
        `);
      });

      it(`handles PL/pgSQL language identifier case-insensitively`, async () => {
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
