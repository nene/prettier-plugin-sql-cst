import * as ts from "typescript";

/**
 * This script analyzes the syntax map files in src/syntax/ dir
 * and checks if all fields are used.
 */

const fileNames = process.argv.slice(2);
const options = {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.CommonJS,
};
// We'll be populating this when we detect unused fields
const errors: string[] = [];

let program = ts.createProgram(fileNames, options);
let checker = program.getTypeChecker();

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    if (isSyntaxMapFile(sourceFile.fileName)) {
      ts.forEachChild(sourceFile, (node) => analyze(node, sourceFile));
    }
  }
}

if (errors.length > 0) {
  console.log(`Found ${errors.length} problems:\n`);
  console.error(errors.join("\n\n"));
  process.exit(1);
}

function isSyntaxMapFile(fileName: string): boolean {
  return (
    fileName.includes("src/syntax/") && !fileName.endsWith("transformMap.ts")
  );
}

function analyze(node: ts.Node, sourceFile: ts.SourceFile) {
  if (ts.isVariableStatement(node)) {
    const mapDeclaration = node.declarationList.declarations.find(
      (declaration) => /\wMap$/.test(declaration.name.getText(sourceFile)),
    );
    if (
      mapDeclaration?.initializer &&
      ts.isObjectLiteralExpression(mapDeclaration.initializer)
    ) {
      ts.forEachChild(mapDeclaration.initializer, (node) =>
        analyzeObjectProperty(node, sourceFile),
      );
    }
  }
}

function analyzeObjectProperty(node: ts.Node, sourceFile: ts.SourceFile) {
  if (!ts.isPropertyAssignment(node) || !ts.isArrowFunction(node.initializer)) {
    return;
  }

  const fields = extractExpectedFields(node.initializer);
  const fieldMap = Object.fromEntries(fields.map((field) => [field, true]));

  visitAll(node, (child) => {
    if (ts.isStringLiteral(child)) {
      fieldMap[child.text] = false;
    }
    if (ts.isPropertyAccessExpression(child)) {
      if (ts.isIdentifier(child.name)) {
        const text = child.name.escapedText.toString();
        fieldMap[text] = false;
      }
    }
  });

  // Ignore fields that are explicitly marked as ignored in the doc comment
  extractDocCommentIgnoredFields(node).forEach((field) => {
    fieldMap[field] = false;
  });

  const missingFields = Object.entries(fieldMap)
    .filter(([, value]) => value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    errors.push(
      [
        `In file: ${sourceFile.fileName.replace(/.*\//, "src/syntax/")}`,
        `Unused fields: ${missingFields.join(", ")}`,
        node.getText(sourceFile),
      ].join("\n"),
    );
  }
}

function extractDocCommentIgnoredFields(node: ts.PropertyAssignment): string[] {
  const matches = extractDocComment(node).match(/\bcst-ignore: (\w+(, *\w+)*)/);
  if (!matches) {
    return [];
  }
  return matches[1].split(/, */);
}

function extractDocComment(node: ts.PropertyAssignment): string {
  const symbol = checker.getSymbolAtLocation(node.name);
  if (!symbol) {
    return "";
  }
  const comment = symbol.getDocumentationComment(checker);
  if (!comment) {
    return "";
  }
  return comment.map((comment) => comment.text).join(" ");
}

function extractExpectedFields(node: ts.ArrowFunction): string[] {
  if (node.parameters.length === 0) {
    return []; // For cases like the empty node
  }
  const symbol = checker.getSymbolAtLocation(node.parameters[0].name);
  if (!symbol) {
    throw new Error("No symbol for function parameter found");
  }
  const type = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!,
  );
  if (!type) {
    throw new Error("No type of function parameter found");
  }
  const argType = type.aliasTypeArguments?.[1];
  if (!argType) {
    throw new Error("No second type argument of function parameter found");
  }
  if (argType.isLiteral()) {
    return [argType.value as string];
  } else if (argType.isUnion()) {
    return argType.types.map((t) =>
      t.isLiteral() ? (t.value as string) : "<unknown>",
    );
  } else {
    throw new Error(`Expected type: ${checker.typeToString(argType)}`);
  }
}

function visitAll(node: ts.Node, cb: (node: ts.Node) => void) {
  cb(node);
  node.forEachChild((child) => visitAll(child, cb));
}
