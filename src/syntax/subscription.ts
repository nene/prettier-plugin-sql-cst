import { AllSubscriptionNodes } from "sql-parser-cst";
import { group, line, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const subscriptionMap: CstToDocMap<AllSubscriptionNodes> = {
  create_subscription_stmt: (print, node) =>
    group(
      join(line, [
        print.spaced(["createSubscriptionKw", "name"]),
        print.spaced(["connectionKw", "connectionInfo"]),
        print.spaced(["publicationKw", "publications"]),
        ...(node.with ? [print.spaced(["with"])] : []),
      ]),
    ),

  drop_subscription_stmt: (print) =>
    group(
      print.spaced(["dropSubscriptionKw", "ifExistsKw", "name", "behaviorKw"]),
    ),
};
