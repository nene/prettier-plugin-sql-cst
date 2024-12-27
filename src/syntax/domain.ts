import { AllDomainNodes } from "sql-parser-cst";
import { group, line, indent, join } from "../print_utils";
import { CstToDocMap } from "../CstToDocMap";

export const domainMap: CstToDocMap<AllDomainNodes> = {
  create_domain_stmt: (print, node) =>
    group([
      print.spaced(["createDomainKw", "name", "asKw", "dataType"]),
      node.constraints.length > 0
        ? indent([print.dynamicLine(), join(line, print("constraints"))])
        : [],
    ]),
  alter_domain_stmt: (print) =>
    group(print.spaced(["alterDomainKw", "name", "action"])),
  drop_domain_stmt: (print) =>
    group(
      print.spaced(["dropDomainKw", "ifExistsKw", "domains", "behaviorKw"]),
    ),
};
