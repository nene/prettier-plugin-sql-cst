import { AllTransactionNodes } from "sql-parser-cst";
import { CstToDocMap } from "../CstToDocMap";

export const transactionMap: Partial<CstToDocMap<AllTransactionNodes>> = {
  start_transaction_stmt: (print) =>
    print.spaced(["startKw", "behaviorKw", "transactionKw"]),
  commit_transaction_stmt: (print) =>
    print.spaced(["commitKw", "transactionKw", "chain"]),
  rollback_transaction_stmt: (print) =>
    print.spaced(["rollbackKw", "transactionKw", "savepoint", "chain"]),
  rollback_to_savepoint: (print) =>
    print.spaced(["toKw", "savepointKw", "savepoint"]),
  savepoint_stmt: (print) => print.spaced(["savepointKw", "savepoint"]),
  release_savepoint_stmt: (print) =>
    print.spaced(["releaseKw", "savepointKw", "savepoint"]),

  transaction_chain_clause: (print) => print.spaced("andChainKw"),
  transaction_no_chain_clause: (print) => print.spaced("andNoChainKw"),
};
