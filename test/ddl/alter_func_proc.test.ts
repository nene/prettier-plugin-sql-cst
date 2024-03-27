import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("alter function/procedure", () => {
  function testAlterStmt(kind: "FUNCTION" | "PROCEDURE") {
    it(`formats basic ALTER ${kind} RENAME TO`, async () => {
      await testPostgresql(`ALTER ${kind} foo RENAME TO bar`);
    });

    it(`formats parameter list`, async () => {
      await testPostgresql(`ALTER ${kind} foo() RENAME TO bar`);
      await testPostgresql(`ALTER ${kind} foo(a INT, b INT) RENAME TO bar`);
    });

    it(`formats long parameter list`, async () => {
      await testPostgresql(dedent`
        ALTER ${kind} do_some_magic(
          first_parameter INT,
          OUT second_parameter VARCHAR(100),
          OUT third_parameter INT
        )
        RENAME TO bar
      `);
    });

    it(`formats various actions`, async () => {
      await testPostgresql(dedent`
        ALTER ${kind} foo()
        OWNER TO john_doe
        SET SCHEMA my_schema
        DEPENDS ON EXTENSION my_extension
        NO DEPENDS ON EXTENSION my_extension
        SET search_path TO my_schema
        SET log_destination = 'stderr'
        SET foo TO DEFAULT
        RESET search_path
        RESET ALL
      `);
    });

    if (kind === "FUNCTION") {
      it(`formats behavior attributes`, async () => {
        await testPostgresql(dedent`
          ALTER ${kind} foo()
          CALLED ON NULL INPUT
          RETURNS NULL ON NULL INPUT
          STRICT
          VOLATILE
          STABLE
          IMMUTABLE
          LEAKPROOF
          NOT LEAKPROOF
          PARALLEL SAFE
          PARALLEL RESTRICTED
          PARALLEL UNSAFE
        `);
      });
    }

    it(`formats security actions`, async () => {
      await testPostgresql(dedent`
        ALTER ${kind} foo()
        SECURITY DEFINER
        SECURITY INVOKER
        EXTERNAL SECURITY DEFINER
        EXTERNAL SECURITY INVOKER
      `);
    });

    if (kind === "FUNCTION") {
      it(`formats cost and rows actions`, async () => {
        await testPostgresql(dedent`
          ALTER ${kind} foo()
          COST 100
          ROWS 1000
        `);
      });

      it(`formats support action`, async () => {
        await testPostgresql(dedent`
          ALTER ${kind} foo()
          SUPPORT my_schema.foo
        `);
      });
    }

    it(`formats RESTRICT after actions`, async () => {
      await testPostgresql(dedent`
        ALTER ${kind} foo() RESET ALL SET foo = 1 RESTRICT
      `);
    });

    it(`formats on multiple lines if the original is multiline`, async () => {
      await testPostgresql(dedent`
        ALTER ${kind} foo()
        RESET ALL
        SET foo = 1
        RESTRICT
      `);
    });
  }

  describe("FUNCTION", () => testAlterStmt("FUNCTION"));
  describe("PROCEDURE", () => testAlterStmt("PROCEDURE"));
});
