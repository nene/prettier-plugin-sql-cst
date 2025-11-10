import dedent from "dedent-js";
import { testPostgresql } from "../test_utils";

describe("comment", () => {
  it(`formats short COMMENT ON`, async () => {
    await testPostgresql(dedent`
      COMMENT ON TABLE revenue IS 'Hello, world!'
    `);
  });

  it(`formats long COMMENT ON`, async () => {
    await testPostgresql(dedent`
      COMMENT ON CONSTRAINT constraint_name ON DOMAIN domain_name IS
        'This is a really nice comment here.'
    `);
  });

  it(`formats multi-line comment`, async () => {
    await testPostgresql(dedent`
      COMMENT ON TABLE foo IS
        'This is a multi-line comment,
        that spans several lines.
        In here.'
    `);
  });

  it(`formats long comment target`, async () => {
    await testPostgresql(dedent`
      COMMENT ON FUNCTION my_absolutely_fantastic_function(
        IN whoopsie CHARACTER VARYING,
        OUT doopsie TEXT
      ) IS
        'This is a really nice comment here.'
    `);
  });

  [
    "ACCESS METHOD foo",
    "AGGREGATE foo(bar INT)",
    "CAST (TEXT AS INT)",
    "COLLATION foo",
    "COLUMN my_table.my_column",
    "CONSTRAINT constraint_name ON table_name",
    "CONSTRAINT constraint_name ON DOMAIN domain_name",
    "CONVERSION foo",
    "DATABASE my_database",
    "DOMAIN my_domain",
    "EXTENSION my_extension",
    "EVENT TRIGGER my_event_trigger",
    "FOREIGN DATA WRAPPER my_foreign_data_wrapper",
    "FOREIGN TABLE my_foreign_table",
    "FUNCTION my_function",
    "FUNCTION my_function(INT, TEXT)",
    // "FUNCTION my_function()", // Not supported by parser
    "INDEX my_index",
    "LANGUAGE mylang",
    "PROCEDURAL LANGUAGE plpgsql",
    "LARGE OBJECT 12345",
    "MATERIALIZED VIEW my_materialized_view",
    // "OPERATOR + (INT, INT)", // Not supported by parser
    "OPERATOR CLASS my_operator_class USING btree",
    "OPERATOR FAMILY my_operator_family USING btree",
    "POLICY my_policy ON my_table",
    "PROCEDURE my_procedure",
    "PROCEDURE my_procedure(INT)",
    "PUBLICATION my_publication",
    "ROLE my_role",
    "ROUTINE my_routine",
    "ROUTINE my_routine(INT)",
    "RULE my_rule ON my_table",
    "SCHEMA my_schema",
    "SEQUENCE my_sequence",
    "SERVER my_server",
    "STATISTICS my_statistics",
    "SUBSCRIPTION my_subscription",
    "TABLE my_table",
    "TABLESPACE my_tablespace",
    "TEXT SEARCH CONFIGURATION my_text_search_configuration",
    "TEXT SEARCH DICTIONARY my_text_search_dictionary",
    "TEXT SEARCH PARSER my_text_search_parser",
    "TEXT SEARCH TEMPLATE my_text_search_template",
    "TRANSFORM FOR INTEGER LANGUAGE my_lang",
    "TRIGGER my_trigger ON my_table",
    "TYPE MY_TYPE",
    "VIEW my_view",
  ].forEach((target) => {
    it(`formats ${target}`, async () => {
      await testPostgresql(dedent`
        COMMENT ON ${target} IS 'Blah'
      `);
    });
  });
});
