import { AllTransactionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";
import { group, indent, line } from "../print_utils";

export const transactionMap: CstToDocMap<AllTransactionNodes> = {
  start_transaction_stmt: (print, node) =>
    group([
      print.spaced(["startKw", "behaviorKw", "transactionKw"]),
      node.modes ? indent([line, print("modes")]) : [],
    ]),
  commit_transaction_stmt: (print) =>
    group(print.spaced(["commitKw", "transactionKw", "chain"])),
  rollback_transaction_stmt: (print) =>
    group(print.spaced(["rollbackKw", "transactionKw", "savepoint", "chain"])),
  rollback_to_savepoint: (print) =>
    print.spaced(["toKw", "savepointKw", "savepoint"]),
  savepoint_stmt: (print) => group(print.spaced(["savepointKw", "savepoint"])),
  release_savepoint_stmt: (print) =>
    group(print.spaced(["releaseKw", "savepointKw", "savepoint"])),

  transaction_chain_clause: (print) => print.spaced("andChainKw"),
  transaction_no_chain_clause: (print) => print.spaced("andNoChainKw"),
  transaction_mode_isolation_level: (print) =>
    print.spaced(["isolationLevelKw", "levelKw"]),
  transaction_mode_deferrable: (print) => print.spaced("deferrableKw"),
  transaction_mode_not_deferrable: (print) => print.spaced("notDeferrableKw"),
  transaction_mode_read_only: (print) => print.spaced("readOnlyKw"),
  transaction_mode_read_write: (print) => print.spaced("readWriteKw"),
};
