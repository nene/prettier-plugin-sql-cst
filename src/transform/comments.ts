import { Program, Whitespace } from "sql-parser-cst";
import { visitAllNodes } from "../visitAllNodes";

/**
 * Gathers comments from .leading and .trailing fields of all nodes
 * into a single .comments field in root Program node.
 *
 * Previously this also deleted all .leading and .trailing fields,
 * but we need this info to check whether the empty lines between nodes
 * are perhaps inside comments (see hasEmptyLineBetweenNodes()).
 */
export const moveCommentsToRoot = (
  cst: Program,
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
  });
  return comments;
};
