import { runAsWorker } from "synckit";
import { Options, format } from "prettier";

runAsWorker(async (sql: string, opts: Options) => {
  return format(sql, opts);
});
