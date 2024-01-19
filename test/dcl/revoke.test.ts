import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("revoke", () => {
  it(`formats short REVOKE in single line`, async () => {
    await testBigquery(dedent`
      REVOKE \`roles/x\` ON VIEW revenue FROM 'user:tom'
    `);
  });

  it(`formats short REVOKE in multiple lines if user prefers`, async () => {
    await testBigquery(dedent`
      REVOKE \`roles/x\`
      ON VIEW revenue
      FROM 'user:tom'
    `);
  });

  it(`formats REVOKE (single role, single user)`, async () => {
    await testBigquery(dedent`
      REVOKE \`roles/bigquery.dataViewer\`
      ON VIEW myCompany.revenue
      FROM 'user:tom@example.com'
    `);
  });

  it(`formats REVOKE (multiple roles, multiple users)`, async () => {
    await testBigquery(dedent`
      REVOKE \`roles/bigquery.dataViewer\`, \`roles/bigquery.admin\`
      ON SCHEMA myCompany
      FROM 'user:tom@example.com', 'user:sara@example.com'
    `);
  });

  it(`formats REVOKE (multiline list of roles and users)`, async () => {
    await testBigquery(dedent`
      REVOKE
        \`roles/bigquery.dataViewer\`,
        \`roles/bigquery.admin\`,
        \`roles/bigquery.rowAccessPolicies.create\`
      ON EXTERNAL TABLE myCompany
      FROM
        'user:tom@example.com',
        'user:sara@example.com',
        'specialGroup:allAuthenticatedUsers'
    `);
  });
});
