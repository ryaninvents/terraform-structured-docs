import * as markdown from "remark-parse";
import * as unified from "unified";

export function getAstFromMarkdown(markdownSource: string): object {
  return unified().use(markdown).parse(markdownSource);
}

export default function convertMarkdownToJson(
  markdownSource: string
): Promise<object> {
  return Promise.resolve({});
}
