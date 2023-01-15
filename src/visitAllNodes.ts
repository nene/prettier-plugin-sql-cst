import { Node } from "sql-parser-cst";
import { isArray, isNode } from "./utils";

/* Executes a function with all nodes in syntax tree */
export const visitAllNodes = (node: Node, visit: (node: Node) => void) => {
  visit(node);

  // Visit all children
  for (const child of Object.values(node)) {
    if (isNode(child)) {
      visitAllNodes(child, visit);
    } else if (isArray(child)) {
      child
        .filter(isNode)
        .forEach((childNode) => visitAllNodes(childNode, visit));
    }
  }
};
