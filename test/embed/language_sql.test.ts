import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("LANGUAGE sql", () => {
  describe("CREATE FUNCTION", () => {
    it(`reformats SQL in dollar-quoted SQL function`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE sql
            AS $body$SELECT 1;
            select 2$body$
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE sql
        AS $body$
          SELECT 1;
          SELECT 2;
        $body$
      `);
    });

    it(`converts single-quoted SQL function to dollar-quoted SQL function`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS TEXT
            LANGUAGE sql
            AS 'SELECT ''foo'''
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS TEXT
        LANGUAGE sql
        AS $$
          SELECT 'foo';
        $$
      `);
    });

    it(`does not reformat single-quoted SQL function when its source contains $$-quotes`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS TEXT
            LANGUAGE sql
            AS 'SELECT $$foo$$'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS TEXT
        LANGUAGE sql
        AS 'SELECT $$foo$$'
      `);
    });

    it(`does not reformat E'quoted' strings`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE sql
            AS E'SELECT 1'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE sql
        AS E'SELECT 1'
      `);
    });

    it(`handles SQL language identifier case-insensitively`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE FUNCTION my_func()
            RETURNS INT
            LANGUAGE Sql
            AS 'SELECT 1'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE FUNCTION my_func()
        RETURNS INT
        LANGUAGE Sql
        AS $$
          SELECT 1;
        $$
      `);
    });
  });

  describe("CREATE PROCEDURE", () => {
    it(`reformats SQL in dollar-quoted SQL procedure`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE PROCEDURE my_proc()
            LANGUAGE sql
            AS $body$SELECT 1;
            select 2$body$
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE PROCEDURE my_proc()
        LANGUAGE sql
        AS $body$
          SELECT 1;
          SELECT 2;
        $body$
      `);
    });

    it(`converts single-quoted SQL procedures to dollar-quoted SQL procedures`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE PROCEDURE my_proc()
            LANGUAGE sql
            AS 'SELECT ''foo'''
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE PROCEDURE my_proc()
        LANGUAGE sql
        AS $$
          SELECT 'foo';
        $$
      `);
    });

    it(`does not reformat single-quoted SQL procedure when its source contains $$-quotes`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE PROCEDURE my_proc()
            LANGUAGE sql
            AS 'SELECT $$foo$$'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE PROCEDURE my_proc()
        LANGUAGE sql
        AS 'SELECT $$foo$$'
      `);
    });

    it(`does not reformat E'quoted' strings`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE PROCEDURE foo()
            LANGUAGE sql
            AS E'SELECT 1'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE PROCEDURE foo()
        LANGUAGE sql
        AS E'SELECT 1'
      `);
    });

    it(`handles SQL language identifier case-insensitively`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE PROCEDURE my_proc()
            LANGUAGE Sql
            AS 'SELECT 1'
          `,
          { dialect: "postgresql" },
        ),
      ).toBe(dedent`
        CREATE PROCEDURE my_proc()
        LANGUAGE Sql
        AS $$
          SELECT 1;
        $$
      `);
    });
  });
});
