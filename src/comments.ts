import { Program, Whitespace } from "sql-parser-cst";
import { visitAllNodes } from "./visitAllNodes";

/**
 * Gathers comments from .leading and .trailing fields of all nodes
 * into a single .comments field in root Program node.
 *
 * Deletes the .leading and .trailing fields of all nodes.
 */
export const moveCommentsToRoot = (
  cst: Program
): Program & { comments: Whitespace[] } => {
  return {
    ...cst,
    comments: extractComments(cst),
  };
};

const extractComments = (cst: Program): Whitespace[] => {
  const comments: Whitespace[] = [];
  visitAllNodes(cst, (node) => {
    comments.push(...(node.leading || []), ...(node.trailing || []));
    delete node.leading;
    delete node.trailing;
  });
  return comments;
};
