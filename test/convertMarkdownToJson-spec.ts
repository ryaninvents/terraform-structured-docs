import test from "ava";
import * as fs from "fs";
import * as path from "path";
import {
  getAstFromMarkdown,
  extractResourceName,
  extractResourceDescription
} from "../src/convertMarkdownToJson";
import extractArguments from "../src/extractArguments";
import extractAttributes from "../src/extractAttributes";

// The path below starts at `$PROJECT_ROOT/lib_test/test`, not `$PROJECT_ROOT/test` which
// is the current location of the test TS source. This is because, when the tests
// actually run, they're run from the compiled JS in the `lib_test` directory.
const AWS_INSTANCE_FILENAME =
  "../../terraform-website/ext/providers/aws/website/docs/r/instance.html.markdown";

test("Should produce AST from source", t => {
  const source = `some **markdown** _text_`;

  t.snapshot(getAstFromMarkdown(source), "AST of markdown");
});

test("Should correctly read resource name", t => {
  const source = fs
    .readFileSync(path.resolve(__dirname, AWS_INSTANCE_FILENAME))
    .toString();
  const ast = getAstFromMarkdown(source);

  const resourceName = extractResourceName(ast);
  t.is(
    resourceName,
    "aws_instance",
    "Should use first H1 header as resource name"
  );
});

test("Should correctly read resource description", t => {
  const source = fs
    .readFileSync(path.resolve(__dirname, AWS_INSTANCE_FILENAME))
    .toString();
  const ast = getAstFromMarkdown(source);

  const description = extractResourceDescription(ast);
  t.is(
    description,
    "Provides an EC2 instance resource. This allows instances to be created, updated, and deleted. Instances also support provisioning.",
    "Should use description from YAML header"
  );
});

test("Should correctly read arguments from Markdown", t => {
  const source = fs
    .readFileSync(path.resolve(__dirname, AWS_INSTANCE_FILENAME))
    .toString();
  const ast = getAstFromMarkdown(source);

  const args = extractArguments(ast);

  // Check a couple basic features of the extracted attributes.
  t.is(
    Object.keys(args).length,
    26,
    "should find the correct number of arguments"
  );
  t.deepEqual(
    args.ami,
    {
      argumentName: "ami",
      forcesNewResource: false,
      description: "\\- (Required) The AMI to use for the instance.",
      isRequired: true
    },
    "Should correctly extract `ami` argument"
  );

  t.snapshot(args, "extracted arguments");
});

test("Should correctly read attributes from Markdown", t => {
  const source = fs
    .readFileSync(path.resolve(__dirname, AWS_INSTANCE_FILENAME))
    .toString();
  const ast = getAstFromMarkdown(source);

  const attrs = extractAttributes(ast);

  t.snapshot(attrs, "extracted attributes");
});
