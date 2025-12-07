import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlIdentifierCase option", () => {
  it(`defaults to preserving the case of unquoted identifiers`, async () => {
    expect(await pretty(`SELECT foo, BAR, Baz, ZapZopZup`)).toBe(dedent`
      SELECT foo, BAR, Baz, ZapZopZup
    `);
  });

  it(`sqlIdentifierCase: "preserve" keeps identifier case as-is`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "preserve",
      }),
    ).toBe(dedent`
      SELECT foo, BAR, Baz, ZapZopZup
    `);
  });

  it(`sqlIdentifierCase: "upper" converts identifiers to uppercase`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT FOO, BAR, BAZ, ZAPZOPZUP
    `);
  });

  it(`sqlIdentifierCase: "lower" converts identifiers to lowercase`, async () => {
    expect(
      await pretty(`SELECT foo, BAR, Baz, ZapZopZup`, {
        sqlIdentifierCase: "lower",
      }),
    ).toBe(dedent`
      SELECT foo, bar, baz, zapzopzup
    `);
  });

  it(`does not change the case of quoted identifiers`, async () => {
    expect(
      await pretty(`SELECT "foo", foo, \`foo\`, [foo]`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT "foo", FOO, \`foo\`, [foo]
    `);
  });

  it(`does not change the case of BigQuery quoted table names`, async () => {
    expect(
      await pretty(`SELECT * FROM \`proj.schm.table\``, {
        sqlIdentifierCase: "upper",
        dialect: "bigquery",
      }),
    ).toBe(dedent`
      SELECT * FROM \`proj.schm.table\`
    `);
  });

  it(`changes case of function names`, async () => {
    expect(
      await pretty(`SELECT count(*), avg(age) FROM people`, {
        sqlIdentifierCase: "upper",
      }),
    ).toBe(dedent`
      SELECT COUNT(*), AVG(AGE) FROM PEOPLE
    `);
  });

  it(`changes case of MySQL variables`, async () => {
    expect(
      await pretty(`SELECT @foo, @Bar_, @foo_bar_123`, {
        sqlIdentifierCase: "upper",
        dialect: "mysql",
      }),
    ).toBe(dedent`
      SELECT @FOO, @BAR_, @FOO_BAR_123
    `);
  });

  it(`does not change case of quoted MySQL variables`, async () => {
    expect(
      await pretty(`SELECT @"foo", @'Bar_', @\`foo_bar_123\``, {
        sqlIdentifierCase: "upper",
        dialect: "mysql",
      }),
    ).toBe(dedent`
      SELECT @"foo", @'Bar_', @\`foo_bar_123\`
    `);
  });

  it(`changes case of BigQuery system variables`, async () => {
    expect(
      await pretty(`SELECT @@foo, @@Bar_, @@foo_bar_123`, {
        sqlIdentifierCase: "upper",
        dialect: "bigquery",
      }),
    ).toBe(dedent`
      SELECT @@FOO, @@BAR_, @@FOO_BAR_123
    `);
  });

  it(`changes case of bound parameters`, async () => {
    expect(
      await pretty(`SELECT :foo, @bar, $baz`, {
        sqlIdentifierCase: "upper",
        sqlParamTypes: [":name", "@name", "$name"],
      }),
    ).toBe(dedent`
      SELECT :FOO, @BAR, $BAZ
    `);
  });

  it(`does not change case of quoted bound parameters`, async () => {
    expect(
      await pretty(`SELECT @\`foo\`, @foo`, {
        sqlIdentifierCase: "upper",
        sqlParamTypes: ["@name", "@`name`"],
      }),
    ).toBe(dedent`
      SELECT @\`foo\`, @FOO
    `);
  });
});
