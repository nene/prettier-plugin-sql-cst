import { format } from "prettier";
import * as plugin from "../src/index";
import { SqlPluginOptions } from "../src/options";

interface PrettyOptions extends Partial<SqlPluginOptions> {
  printWidth?: number;
}

export const pretty = (sql: string, opts: PrettyOptions = {}) => {
  return format(sql, {
    parser: "sql-parser-cst",
    plugins: [plugin],
    ...opts,
  });
};
