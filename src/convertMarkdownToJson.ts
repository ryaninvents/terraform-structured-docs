import * as unified from "unified";
import * as markdown from "remark-parse";

export function getAstFromMarkdown(markdownSource: string): Promise<object> {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .parse(markdownSource, function(err: null | Error, ast: object) {
        if (err) {
          reject(err);
          return;
        }
        resolve(ast);
      });
  });
}

export default function convertMarkdownToJson(
  markdownSource: string
): Promise<object> {
  return Promise.resolve({});
}
