import dedent from "dedent-js";
import { pretty } from "../test_utils";

const statements = [
  { name: "CREATE FUNCTION", code: "CREATE FUNCTION my_func()\nRETURNS INT" },
  { name: "CREATE PROCEDURE", code: "CREATE PROCEDURE my_proc()" },
];

describe("LANGUAGE sql", () => {
  statements.forEach(({ name, code }) => {
    describe(name, () => {
      it(`reformats SQL in dollar-quoted string`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE sql
              AS $body$SELECT 1;
              select 2$body$
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE sql
          AS $body$
            SELECT 1;
            SELECT 2;
          $body$
        `);
      });

      it(`converts single-quoted SQL string to dollar-quoted string`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE sql
              AS 'SELECT ''foo'''
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE sql
          AS $$
            SELECT 'foo';
          $$
        `);
      });

      it(`does not reformat single-quoted SQL string when its source contains $$-quotes`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE sql
              AS 'SELECT $$foo$$'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE sql
          AS 'SELECT $$foo$$'
        `);
      });

      it(`does not reformat E'quoted' strings`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE sql
              AS E'SELECT 1'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE sql
          AS E'SELECT 1'
        `);
      });

      it(`handles SQL language identifier case-insensitively`, async () => {
        expect(
          await pretty(
            dedent`
              ${code}
              LANGUAGE Sql
              AS 'SELECT 1'
            `,
            { dialect: "postgresql" },
          ),
        ).toBe(dedent`
          ${code}
          LANGUAGE Sql
          AS $$
            SELECT 1;
          $$
        `);
      });
    });
  });
});
