import dedent from "dedent-js";
import { testBigquery, testPostgresql } from "../test_utils";

describe("grant", () => {
  describe("bigquery", () => {
    it(`formats short GRANT in single line`, async () => {
      await testBigquery(dedent`
        GRANT \`roles/x\` ON TABLE revenue TO 'user:tom'
      `);
    });

    it(`formats short GRANT in multiple lines if user prefers`, async () => {
      await testBigquery(dedent`
        GRANT \`roles/x\`
        ON TABLE revenue
        TO 'user:tom'
      `);
    });

    it(`formats GRANT (single privilege, single user)`, async () => {
      await testBigquery(dedent`
        GRANT \`roles/bigquery.dataViewer\`
        ON TABLE myCompany.revenue
        TO 'user:tom@example.com'
      `);
    });

    it(`formats GRANT (multiple privileges, multiple users)`, async () => {
      await testBigquery(dedent`
        GRANT \`roles/bigquery.dataViewer\`, \`roles/bigquery.admin\`
        ON SCHEMA myCompany
        TO 'user:tom@example.com', 'user:sara@example.com'
      `);
    });

    it(`formats GRANT (multiline list of privileges and users)`, async () => {
      await testBigquery(dedent`
        GRANT
          \`roles/bigquery.dataViewer\`,
          \`roles/bigquery.admin\`,
          \`roles/bigquery.rowAccessPolicies.create\`
        ON SCHEMA myCompany
        TO
          'user:tom@example.com',
          'user:sara@example.com',
          'specialGroup:allAuthenticatedUsers'
      `);
    });
  });

  describe("postgresql", () => {
    it(`formats short GRANT in single line`, async () => {
      await testPostgresql(dedent`
        GRANT SELECT ON schm.my_table TO john_doe
      `);
    });

    it(`formats privilege limited to specific columns`, async () => {
      await testPostgresql(dedent`
        GRANT UPDATE (foo, bar, baz) ON tbl TO john
      `);
    });

    it(`formats ALL PRIVILEGES`, async () => {
      await testPostgresql(dedent`
        GRANT ALL PRIVILEGES ON tbl TO john
      `);
      await testPostgresql(dedent`
        GRANT ALL ON tbl TO john
      `);
    });

    it(`formats ALL PRIVILEGES on specific columns`, async () => {
      await testPostgresql(dedent`
        GRANT ALL PRIVILEGES (foo, bar, baz) ON tbl TO john
      `);
    });

    [
      "TABLE foo, bar",
      "ALL TABLES IN SCHEMA schm1, schm2",
      "SEQUENCE seq1, seq2",
      "ALL SEQUENCES IN SCHEMA schm1, schm2",
      "DATABASE db1, db2",
      "DOMAIN dom1, dom2",
      "FOREIGN DATA WRAPPER fdw1, fdw2",
      "FOREIGN SERVER fs1, fs2",
      "FUNCTION func1, func2",
      "FUNCTION func1(), func2()",
      "FUNCTION f(INT), g(INOUT a INT, OUT b TEXT)",
      "ALL FUNCTIONS IN SCHEMA schm1, schm2",
      "LANGUAGE lang1, lang2",
      "LARGE OBJECT 1234, 5678",
      "PARAMETER foo, bar",
      "SCHEMA schm1, schm2",
      "TABLESPACE ts1, ts2",
      "TYPE typ1, typ2",
    ].forEach((resource) => {
      it(`formats ON ${resource}`, async () => {
        await testPostgresql(dedent`
          GRANT USAGE ON ${resource} TO john
        `);
      });
    });

    it(`formats WITH GRANT OPTION clause`, async () => {
      await testPostgresql(dedent`
        GRANT SELECT ON tbl TO john WITH GRANT OPTION
      `);
    });

    it(`formats GRANTED BY clause`, async () => {
      await testPostgresql(dedent`
        GRANT SELECT ON tbl TO john GRANTED BY CURRENT_USER
      `);
    });

    it(`formats long GRANT to multiple lines`, async () => {
      await testPostgresql(dedent`
        GRANT SELECT
        ON tbl
        TO john
        GRANTED BY john_doe
        WITH GRANT OPTION
      `);
    });

    [
      "PUBLIC",
      "GROUP my_group",
      "CURRENT_USER",
      "CURRENT_ROLE",
      "SESSION_USER",
    ].forEach((role) => {
      it(`formats GRANT TO ${role}`, async () => {
        await testPostgresql(dedent`
          GRANT SELECT ON tbl TO ${role}
        `);
      });
    });
  });
});
