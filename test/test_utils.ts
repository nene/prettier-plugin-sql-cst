import { format } from "prettier";
import * as plugin from "../src/index";

interface PrettyOptions {
  printWidth?: number;
  sqlKeywordCase?: "preserve" | "upper" | "lower";
}

export const pretty = (sql: string, opts: PrettyOptions = {}) => {
  return format(sql, {
    parser: "sql-parser-cst",
    plugins: [plugin],
    ...opts,
  });
};
