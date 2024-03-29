import { cstVisitor, Program } from "sql-parser-cst";
import { keyword } from "./transformUtils";

export const canonicKeywords = (cst: Program): Program => {
  cstVisitor({
    // Replaces TEMP with TEMPORARY
    relation_kind: (node) => {
      if (Array.isArray(node.kindKw)) {
        // TODO...
      } else {
        if (node.kindKw.name === "TEMP") {
          node.kindKw.name = "TEMPORARY";
          node.kindKw.text = "TEMPORARY";
        }
      }
    },
    // Replaces MySQL SELECT DISTINCTROW with SELECT DISTINCT
    select_distinct: (node) => {
      if (node.distinctKw.name === "DISTINCTROW") {
        node.distinctKw.name = "DISTINCT";
        node.distinctKw.text = "DISTINCT";
      }
    },
    // Replaces RENAME & RENAME AS with RENAME TO
    alter_action_rename: (node) => {
      if (Array.isArray(node.renameKw)) {
        if (node.renameKw[1].name === "AS") {
          node.renameKw[1].name = "TO";
          node.renameKw[1].text = "TO";
        }
      } else {
        node.renameKw = [node.renameKw, keyword("TO")];
      }
    },
    // Replaces INSERT with INSERT INTO
    insert_clause: (node) => {
      if (!node.intoKw) {
        node.intoKw = keyword("INTO");
      }
    },
    // Replaces MERGE with MERGE INTO
    merge_clause: (node) => {
      if (!node.intoKw) {
        node.intoKw = keyword("INTO");
      }
    },
    // Replaces DELETE with DELETE FROM
    delete_clause: (node) => {
      if (!node.fromKw) {
        node.fromKw = keyword("FROM");
      }
    },
    // Replaces TRUNCATE with TRUNCATE TABLE
    truncate_stmt: (node) => {
      if (!node.tableKw) {
        node.tableKw = keyword("TABLE");
      }
    },
  })(cst);

  return cst;
};
