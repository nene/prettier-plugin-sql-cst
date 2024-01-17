import { cstVisitor, Keyword, Program } from "sql-parser-cst";

export const canonicKeywords = (cst: Program): Program => {
  cstVisitor({
    // Replaces TEMP with TEMPORARY
    create_table_stmt: (node) => {
      if (node.temporaryKw && node.temporaryKw.name === "TEMP") {
        node.temporaryKw.name = "TEMPORARY";
        node.temporaryKw.text = "TEMPORARY";
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
    alter_action_rename_table: (node) => {
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
    // Replaces DELETE with DELETE FROM
    delete_clause: (node) => {
      if (!node.fromKw) {
        node.fromKw = keyword("FROM");
      }
    },
  })(cst);

  return cst;
};

function keyword<T extends string>(name: T): Keyword<T> {
  return { type: "keyword", name, text: name };
}
