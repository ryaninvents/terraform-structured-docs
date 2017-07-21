import test from "ava";
import { getAstFromMarkdown } from "../src/convertMarkdownToJson";

test("Should produce AST from source", t => {
  const source = `some **markdown** _text_`;

  t.snapshot(getAstFromMarkdown(source), "AST of markdown");
});
