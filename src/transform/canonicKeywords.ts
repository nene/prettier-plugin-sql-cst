import { cstVisitor, Program } from "sql-parser-cst";

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
        node.renameKw = [
          node.renameKw,
          { type: "keyword", name: "TO", text: "TO" },
        ];
      }
    },
  })(cst);

  return cst;
};
