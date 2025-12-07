import dedent from "dedent-js";
import { pretty } from "../test_utils";

describe("sqlFunctionCase option", () => {
  it(`defaults to preserving the case of function names`, async () => {
    expect(await pretty(`SELECT foo(), BAR(), Baz(), ZapZopZup()`)).toBe(dedent`
      SELECT foo(), BAR(), Baz(), ZapZopZup()
    `);
  });

  it(`sqlFunctionCase: "preserve" keeps function names as-is`, async () => {
    expect(
      await pretty(`SELECT foo(), BAR(), Baz(), ZapZopZup()`, {
        sqlFunctionCase: "preserve",
      }),
    ).toBe(dedent`
      SELECT foo(), BAR(), Baz(), ZapZopZup()
    `);
  });

  it(`sqlFunctionCase: "upper" converts function names to uppercase`, async () => {
    expect(
      await pretty(`SELECT foo(), BAR(), Baz(), ZapZopZup()`, {
        sqlFunctionCase: "upper",
      }),
    ).toBe(dedent`
      SELECT FOO(), BAR(), BAZ(), ZAPZOPZUP()
    `);
  });

  it(`sqlFunctionCase: "lower" converts function names to lowercase`, async () => {
    expect(
      await pretty(`SELECT foo(), BAR(), Baz(), ZapZopZup()`, {
        sqlFunctionCase: "lower",
      }),
    ).toBe(dedent`
      SELECT foo(), bar(), baz(), zapzopzup()
    `);
  });

  it(`does not change the case of quoted function names`, async () => {
    expect(
      await pretty(`SELECT "foo"(), foo(), \`foo\`(), [foo]()`, {
        sqlFunctionCase: "upper",
      }),
    ).toBe(dedent`
      SELECT "foo"(), FOO(), \`foo\`(), [foo]()
    `);
  });

  it(`changes case of schema-qualified function names`, async () => {
    expect(
      await pretty(`SELECT schm.foo(a, b)`, {
        sqlFunctionCase: "upper",
      }),
    ).toBe(dedent`
      SELECT schm.FOO(a, b)
    `);
  });

  ["FUNCTION", "PROCEDURE"].forEach((funcKw) => {
    it(`changes case of function name in CREATE ${funcKw}`, async () => {
      expect(
        await pretty(`CREATE ${funcKw} foo(a, b) AS ''`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        CREATE ${funcKw} FOO(a, b) AS ''
      `);
    });

    it(`changes case of qualified function name in CREATE ${funcKw}`, async () => {
      expect(
        await pretty(`CREATE ${funcKw} scm.foo(a, b) AS ''`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        CREATE ${funcKw} scm.FOO(a, b) AS ''
     `);
    });

    it(`changes case of function name in ALTER ${funcKw}`, async () => {
      expect(
        await pretty(`ALTER ${funcKw} foo RENAME TO bar`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        ALTER ${funcKw} FOO RENAME TO BAR
      `);
    });

    it(`changes case of qualified function name in ALTER ${funcKw}`, async () => {
      expect(
        await pretty(`ALTER ${funcKw} scm1.foo RENAME TO scm2.bar`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        ALTER ${funcKw} scm1.FOO RENAME TO scm2.BAR
      `);
    });

    it(`changes case of function name in DROP ${funcKw}`, async () => {
      expect(
        await pretty(`DROP ${funcKw} foo`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        DROP ${funcKw} FOO
      `);
    });

    it(`changes case of qualified function name in DROP ${funcKw}`, async () => {
      expect(
        await pretty(`DROP ${funcKw} scm.foo`, {
          sqlFunctionCase: "upper",
          dialect: "postgresql",
        }),
      ).toBe(dedent`
        DROP ${funcKw} scm.FOO
      `);
    });
  });
});
