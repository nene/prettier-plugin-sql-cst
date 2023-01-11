const { parse } = require("sql-parser-cst");
const prettier = require("prettier");

const {
  doc: {
    builders: { join, line, indent },
  },
} = prettier;

const languages = [
  {
    extensions: [".sql"],
    name: "SQL",
    parsers: ["sql-parse"],
  },
];

const parsers = {
  "sql-parse": {
    parse: (text) => parse(text, { dialect: "sqlite", includeRange: true }),
    astFormat: "sql-ast",
    locStart: (node) => node.range?.[0],
    locEnd: (node) => node.range?.[1],
  },
};

function printSql(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case "program":
      return path.map(print, "statements");
    case "select_stmt":
      return path.map(print, "clauses");
    case "select_clause":
      return [
        print("selectKw"),
        indent([line, join([",", line], print("columns"))]),
      ];
    case "list_expr":
      return path.map(print, "items");
    case "keyword":
      return node.text;
    case "number_literal":
      return node.text;
    default:
      throw new Error(`Unexpected node type: ${node.type}`);
  }
}

const printers = {
  "sql-ast": {
    print: printSql,
  },
};

module.exports = {
  languages,
  parsers,
  printers,
};
