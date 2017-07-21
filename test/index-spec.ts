import test from "ava";
import * as index from "../src/index";

test("Should have convertMarkdownToJson available", t => {
  t.truthy(index.getAstFromMarkdown);
});
