import { AllSubscriptionNodes } from "sql-parser-cst";
import { group, indent, line, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const subscriptionMap: Partial<CstToDocMap<AllSubscriptionNodes>> = {
  create_subscription_stmt: (print, node) =>
    group(
      join(line, [
        print.spaced(["createSubscriptionKw", "name"]),
        print.spaced(["connectionKw", "connectionInfo"]),
        print.spaced(["publicationKw", "publications"]),
        ...(node.with ? [print.spaced(["with"])] : []),
      ]),
    ),
};
