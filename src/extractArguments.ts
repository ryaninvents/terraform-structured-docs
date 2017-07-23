/// <reference path="../@types/types.d.ts" />
/// <reference path="../@types/libs.d.ts" />
import * as stringify from "remark-stringify";
import unified = require("unified");
import get = require("lodash/get");

/** Text of header signifying arguments are to follow. */
const ARGREF_HEADER = "argument reference";

/** Regex used to tell if an attribute is required or optional. */
const REQ_OPT_REGEX = /^\s*[\\]*-?\s*\(((?:Required|Optional)(?:[^,)]*)(, Forces new \w+)?)\)/i;

export function listItemToArgument(
  node: Remark.ListItemNode
): ResourceArgument {
  // ASSUMPTION: First child of `node` will be a paragraph, and the first child of that
  // paragraph will be an `inlineCode` node containing the name of the argument.
  const argumentName: string = get(node, [
    "children",
    0,
    "children",
    0,
    "value"
  ]);

  // Create a copy of `node`, without the `inlineCode` node specifying argument name.
  const newNode: Remark.ParagraphNode = {
    type: "paragraph",
    children: [
      {
        ...node.children[0],
        children: (node.children[0] as Remark.ParagraphNode).children.slice(1)
      },
      ...node.children.slice(1)
    ],
    position: node.position
  };

  // Render the modified AST node back to Markdown so we can use RegExp to extract required/optional status.
  const rendered = unified().use(stringify).stringify(newNode);
  const match = REQ_OPT_REGEX.exec(rendered);
  if (match === null) {
    throw new Error(`Could not match ${JSON.stringify(rendered)}`);
  }
  const [fullMatch, reqOptLabel, forcesNewResource] = match as string[];

  return {
    argumentName,
    isRequired: reqOptLabel.trim().toLowerCase().slice(0, 8) === "required",
    forcesNewResource: Boolean(forcesNewResource),
    description: rendered.slice(fullMatch.length).trim()
  };
}

/**
 * Given a Remark AST, return a summary of the resource arguments.
 */
export default function extractArguments(
  ast: Remark.RootNode
): { [argName: string]: ResourceArgument } {
  let foundHeading = false;

  for (let i = 0; i < ast.children.length; i++) {
    const currentChild = ast.children[i];
    switch (currentChild.type) {
      case "heading":
        if (
          get(currentChild, ["children", 0, "value"], "")
            .trim()
            .toLowerCase() === ARGREF_HEADER
        ) {
          foundHeading = true;
        }
        break;
      case "list":
        if (!foundHeading) break;
        return (currentChild as Remark.ListNode).children
          .map(listItemToArgument)
          .reduce(
            (args, next: ResourceArgument) => ({
              ...args,
              [next.argumentName]: next
            }),
            {}
          );
      default:
        break;
    }
  }

  return {};
}
