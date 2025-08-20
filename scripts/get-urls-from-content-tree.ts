import fs from "fs";
import ts from "typescript";

export function getUrls(base: string) {
  return [base, ...getLinks().map((x) => `${base}${x}`)];
}

export function getLinks(): string[] {
  // parsing the content-tree of all the chapters, so that we don't have
  // to deal with the trouble of handling MDX imports or brittle JSON parsing of the text
  const indexSource = fs.readFileSync("./src/content/index.ts", "utf-8");
  const ast = ts.createSourceFile(
    "index.ts",
    indexSource,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  return getLinksFromAST(ast);
}

// AST Walking functions to get the links

function getLinksFromAST(ast: ts.SourceFile): string[] {
  const assignment: any = ast.statements.find(
    (x) => x.kind === ts.SyntaxKind.FirstStatement,
  );
  if (!assignment || assignment.kind !== ts.SyntaxKind.FirstStatement) {
    throw new Error();
  }
  if (
    assignment.declarationList.declarations[0].name.escapedText !==
    "contentTree"
  ) {
    throw new Error();
  }
  const objects: ts.ObjectLiteralExpression[] =
    assignment.declarationList.declarations[0].initializer.elements;
  return objects.flatMap(getLinksFromObject);
}

function getLinksFromObject(o: ts.ObjectLiteralExpression): string[] {
  const slug = getStringValFromObj("slug")(o);
  if (slug) {
    return [`/${slug}`];
  }
  const subdirectory = getStringValFromObj("subdirectory")(o);
  if (!subdirectory) {
    throw new Error("couldn't find subdirectory in parsing");
  }
  const chapters: any = (
    o.properties.find((x: any) => x.name.escapedText === "chapters") as any
  )?.initializer.elements;
  if (!chapters) {
    throw new Error("couldn't find chapters in parsing");
  }
  return chapters
    .flatMap(getLinksFromObject)
    .map((x: any) => `/${subdirectory}${x}`);
}

function getStringValFromObj(key: string) {
  return function (x: ts.ObjectLiteralExpression): string | undefined {
    const value: any = x.properties.find(
      (y: any) => y.name && y.name.escapedText === key,
    );
    if (!value) return undefined;
    if (typeof value.initializer.text !== "string") {
      throw new Error();
    }
    return value.initializer.text;
  };
}
