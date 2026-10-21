import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlWrap option", () => {
  describe("with sqlWrap: preserve (the default)", () => {
    it(`keeps multi-line statement on multiple lines`, async () => {
      expect(
        await pretty(dedent`
          SELECT a, b, c
          FROM tbl
          WHERE x > 10
        `),
      ).toBe(dedent`
        SELECT a, b, c
        FROM tbl
        WHERE x > 10
      `);
    });
  });

  describe("with sqlWrap: collapse", () => {
    it(`formats multi-line statement on single line when it fits`, async () => {
      expect(
        await pretty(
          dedent`
            SELECT a, b, c
            FROM tbl
            WHERE x > 10
          `,
          { sqlWrap: "collapse" },
        ),
      ).toBe(`SELECT a, b, c FROM tbl WHERE x > 10`);
    });

    it(`formats multi-line SELECT columns on single line when they fit`, async () => {
      expect(
        await pretty(
          dedent`
            SELECT
              id,
              name
            FROM person
          `,
          { sqlWrap: "collapse" },
        ),
      ).toBe(`SELECT id, name FROM person`);
    });

    it(`formats multi-line CREATE TABLE on single line when it fits`, async () => {
      expect(
        await pretty(
          dedent`
            CREATE TABLE person (
              id INT,
              name TEXT
            )
          `,
          { sqlWrap: "collapse" },
        ),
      ).toBe(`CREATE TABLE person (id INT, name TEXT)`);
    });

    it(`still breaks statement that does not fit`, async () => {
      expect(
        await pretty(`SELECT a, b, c FROM tbl WHERE x > 10`, {
          sqlWrap: "collapse",
          printWidth: 20,
        }),
      ).toBe(dedent`
        SELECT a, b, c
        FROM tbl
        WHERE x > 10
      `);
    });

    it(`keeps empty line between statements`, async () => {
      expect(
        await pretty(
          dedent`
            SELECT 1;

            SELECT 2
          `,
          { sqlWrap: "collapse" },
        ),
      ).toBe(dedent`
        SELECT 1;

        SELECT 2
      `);
    });
  });
});
