/// <reference path="../@types/types.d.ts" />
/// <reference path="../@types/libs.d.ts" />

import * as markdown from "remark-parse";
import * as stringify from 'remark-stringify';
import { safeLoad } from "js-yaml";

import unified = require('unified');

import extractArguments from './extractArguments';

export function getAstFromMarkdown(markdownSource: string): Remark.RootNode {
  return unified().use(markdown).parse(markdownSource);
}

export function extractResourceDescription(ast: Remark.RootNode): string {
  const yamlNode = ast.children.find((node) => node.type === 'yaml');
  if (!yamlNode) throw new Error('Could not find resource description');
  const yamlContents = safeLoad((yamlNode as Remark.YamlNode).value);
  return yamlContents.description;
}

export function extractResourceName(ast: Remark.RootNode): string {
  const headingNode = ast.children.find((node) => node.type === 'heading') as Remark.HeadingNode;
  if (!headingNode) throw new Error('Could not find resource name');
  return unified().use(stringify).stringify(headingNode).replace(/^\s*#\s*/, '');
}

export function extractResourceDataFromMdAst(ast: Remark.RootNode): ResourceType {
  const description = extractResourceDescription(ast);
  const resourceName = extractResourceName(ast);
  return {
    description,
    resourceName,
    arguments: extractArguments(ast),
    attributes: {},
  };
}

export default function convertMarkdownToJson(markdownSource: string): object {
  return {};
}
