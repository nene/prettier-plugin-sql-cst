import { AllBigqueryNodes } from "sql-parser-cst";
import { group, hardline, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const bigqueryMap: Partial<CstToDocMap<AllBigqueryNodes>> = {
  bigquery_options: (print) => print.spaced(["optionsKw", "options"]),
  bigquery_option_default_collate: (print) =>
    print.spaced(["defaultCollateKw", "collation"]),

  // ROW ACCESS POLICY
  create_row_access_policy_stmt: (print) =>
    join(hardline, [
      print.spaced([
        "createKw",
        "orReplaceKw",
        "rowAccessPolicyKw",
        "ifNotExistsKw",
        "name",
        "onKw",
        "table",
      ]),
      ...print("clauses"),
    ]),
  row_access_policy_grant_clause: (print) =>
    print.spaced(["grantToKw", "grantees"]),
  row_access_policy_filter_clause: (print) =>
    print.spaced(["filterUsingKw", "expr"]),
  drop_row_access_policy_stmt: (print) =>
    print.spaced([
      "dropKw",
      "allKw",
      "rowAccessPolicyKw",
      "ifExistsKw",
      "name",
      "onKw",
      "table",
    ]),

  // CAPACITY
  create_capacity_stmt: (print) => [
    print.spaced(["createKw", "capacityKw", "name"]),
    hardline,
    print("options"),
  ],
  drop_capacity_stmt: (print) =>
    print.spaced(["dropKw", "capacityKw", "ifExistsKw", "name"]),
  // RESERVATION
  create_reservation_stmt: (print) => [
    print.spaced(["createKw", "reservationKw", "name"]),
    hardline,
    print("options"),
  ],
  drop_reservation_stmt: (print) =>
    print.spaced(["dropKw", "reservationKw", "ifExistsKw", "name"]),
  // ASSIGNMENT
  create_assignment_stmt: (print) => [
    print.spaced(["createKw", "assignmentKw", "name"]),
    hardline,
    print("options"),
  ],
  drop_assignment_stmt: (print) =>
    print.spaced(["dropKw", "assignmentKw", "ifExistsKw", "name"]),

  // ALTER ORGANIZATION
  alter_organization_stmt: (print) =>
    join(hardline, [print.spaced("alterOrganizationKw"), print("actions")]),
  // ALTER PROJECT
  alter_project_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterProjectKw", "name"]),
      print("actions"),
    ]),
  alter_bi_capacity_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterBiCapacityKw", "name"]),
      print("actions"),
    ]),
  alter_capacity_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterCapacityKw", "name"]),
      print("actions"),
    ]),
  alter_reservation_stmt: (print) =>
    join(hardline, [
      print.spaced(["alterReservationKw", "name"]),
      print("actions"),
    ]),

  // ASSERT
  assert_stmt: (print) => print.spaced(["assertKw", "expr", "as"]),

  // EXPORT
  export_data_stmt: (print) =>
    join(hardline, [
      print.spaced("exportDataKw"),
      ...print.spaced(["withConnection"]),
      print.spaced("options"),
      print.spaced("as"),
    ]),
  // LOAD
  load_data_stmt: (print) =>
    join(hardline, [
      print.spaced(["loadDataKw", "intoKw", "table", "columns"]),
      ...print("clauses"),
    ]),
  from_files_options: (print) => print.spaced(["fromFilesKw", "options"]),
};
