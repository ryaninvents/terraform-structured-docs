/// <reference path="../@types/types.d.ts" />
/// <reference path="../@types/libs.d.ts" />
import * as stringify from "remark-stringify";
import unified = require("unified");
import get = require("lodash/get");

/** Text of header signifying attributes are to follow. */
const ATTRREF_HEADER = "attributes reference";

const LEAD_IN_REGEX = /^\s*[\\]*-/;

function listItemToAttribute(node: Remark.ListNode): ResourceAttribute {
  const attributeName: string = get(node, [
    "children",
    0,
    "children",
    0,
    "value"
  ]);

  // Create a copy of `node`, without the `inlineCode` node specifying attribute name.
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

  return {
    attributeName,
    description: unified()
      .use(stringify)
      .stringify(newNode)
      .replace(LEAD_IN_REGEX, "")
      .trim()
  };
}

/**
 * Given a Remark AST, return a summary of the resource attributes..
 */
export default function extractAttributes(
  ast: Remark.RootNode
): { [argName: string]: ResourceAttribute } {
  let foundHeading = false;

  for (let i = 0; i < ast.children.length; i++) {
    const currentChild = ast.children[i];
    switch (currentChild.type) {
      case "heading":
        if (
          get(currentChild, ["children", 0, "value"], "")
            .trim()
            .toLowerCase() === ATTRREF_HEADER
        ) {
          foundHeading = true;
        }
        break;
      case "list":
        if (!foundHeading) break;
        return (currentChild as Remark.ListNode).children
          .map(listItemToAttribute)
          .reduce(
            (args, next: ResourceAttribute) => ({
              ...args,
              [next.attributeName]: next
            }),
            {}
          );
      default:
        break;
    }
  }

  return {};
}
