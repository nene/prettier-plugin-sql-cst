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
});
