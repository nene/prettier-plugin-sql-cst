import { Doc, Options, Printer } from "prettier";
import {
  CreateFunctionStmt,
  CreateProcedureStmt,
  Node,
  StringLiteral,
} from "sql-parser-cst";
import {
  isAsClause,
  isCreateFunctionStmt,
  isCreateProcedureStmt,
  isDoStmt,
  isLanguageClause,
  isStringLiteral,
} from "./node_utils";
import { hardline, indent, stripTrailingHardline } from "./print_utils";
import { AllPrettierOptions } from "./options";

export const embedSql: NonNullable<Printer<Node>["embed"]> = (
  path,
  options,
) => {
  const node = path.node;
  const parent = path.getParentNode(0);
  const grandParent = path.getParentNode(1);
  const pluginOptions: Partial<AllPrettierOptions> = options;

  if (!isStringLiteral(node)) {
    return null;
  }

  if (isAsClause(parent) && isRoutine(grandParent)) {
    if (grandParent.clauses.some(isSqlLanguageClause)) {
      return sqlFormatter(node, pluginOptions);
    }
    if (
      grandParent.clauses.some(isPlpgsqlLanguageClause) &&
      pluginOptions.sqlExperimentalPlpgsql
    ) {
      return plpgsqlFormatter(node, pluginOptions);
    }
  }
  if (isDoStmt(parent)) {
    if (!parent.language || isPlpgsqlLanguageClause(parent.language)) {
      return plpgsqlFormatter(node, pluginOptions);
    }
    if (isSqlLanguageClause(parent.language)) {
      return sqlFormatter(node, pluginOptions);
    }
  }

  return null;
};

const sqlFormatter = (
  node: any,
  pluginOptions: Partial<AllPrettierOptions>,
) => {
  return async (
    textToDoc: (text: string, options: Options) => Promise<Doc>,
  ) => {
    const quote = detectQuote(node);
    if (!quote) {
      return undefined;
    }

    const sql = await textToDoc(node.value, pluginOptions);

    return [
      quote,
      indent([hardline, stripTrailingHardline(sql)]),
      hardline,
      quote,
    ];
  };
};

const plpgsqlFormatter = (
  node: any,
  pluginOptions: Partial<AllPrettierOptions>,
) => {
  return async (
    textToDoc: (text: string, options: Options) => Promise<Doc>,
  ) => {
    const quote = detectQuote(node);
    if (!quote) {
      return undefined;
    }

    const sql = await textToDoc(node.value, {
      ...pluginOptions,
      parser: "plpgsql",
    });

    return [quote, [hardline, stripTrailingHardline(sql)], hardline, quote];
  };
};

const isRoutine = (
  node: any,
): node is CreateFunctionStmt | CreateProcedureStmt =>
  isCreateFunctionStmt(node) || isCreateProcedureStmt(node);

const isSqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) && clause.name.name.toLowerCase() === "sql";

const isPlpgsqlLanguageClause = (
  clause: CreateFunctionStmt["clauses"][0] | CreateProcedureStmt["clauses"][0],
): boolean =>
  isLanguageClause(clause) && clause.name.name.toLowerCase() === "plpgsql";

const detectQuote = (node: StringLiteral): string | undefined => {
  const match = node.text.match(/^('|\$[^$]*\$)/);
  const quote = match?.[1];
  if (quote === "'") {
    // Convert `'` quotes to `$$`.
    // But bail out if the code already contains $$.
    return node.value.includes("$$") ? undefined : "$$";
  } else {
    return quote;
  }
};
