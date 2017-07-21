import test from "ava";
import * as fs from 'fs';
import * as path from 'path';
import { getAstFromMarkdown } from "../src/convertMarkdownToJson";

// The path below starts at `$PROJECT_ROOT/lib_test/test`, not `$PROJECT_ROOT/test` which
// is the current location of the test TS source. This is because, when the tests
// actually run, they're run from the compiled JS in the `lib_test` directory.
const AWS_INSTANCE_FILENAME = '../../terraform-website/ext/providers/aws/website/docs/r/instance.html.markdown';

test("Should produce AST from source", t => {
  const source = `some **markdown** _text_`;

  t.snapshot(getAstFromMarkdown(source), "AST of markdown");
});

test('Should produce AST from AWS doc file', t => {
  const source = fs.readFileSync(path.resolve(__dirname, AWS_INSTANCE_FILENAME)).toString();
  t.snapshot(getAstFromMarkdown(source), "AST of AWS Instance documentation");
});
