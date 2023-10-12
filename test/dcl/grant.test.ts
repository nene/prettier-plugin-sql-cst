import dedent from "dedent-js";
import { testBigquery } from "../test_utils";

describe("grant", () => {
  it(`formats GRANT (single role, single user)`, async () => {
    testBigquery(dedent`
      GRANT \`roles/bigquery.dataViewer\`
      ON TABLE myCompany.revenue
      TO 'user:tom@example.com'
    `);
  });

  it(`formats GRANT (multiple roles, multiple users)`, async () => {
    testBigquery(dedent`
      GRANT \`roles/bigquery.dataViewer\`, \`roles/bigquery.admin\`
      ON SCHEMA myCompany
      TO 'user:tom@example.com', 'user:sara@example.com'
    `);
  });

  it(`formats GRANT (multiline list of roles and users)`, async () => {
    testBigquery(dedent`
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
