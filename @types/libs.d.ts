declare namespace Remark {
  type Position = {
    start: number,
    end: number,
    indent: Array<number>,
  };

  interface BaseNode { type: string, position: Position }

  interface Parent extends BaseNode {
    /** Child nodes contained within this one. */
    children: Node[],
  }

  interface Leaf extends BaseNode {
    /** Text value of the leaf node */
    value: string,
  }

  /** AST node representing the root of a Markdown file. */
  interface RootNode extends Parent { type: 'root' }

  /** YAML "front matter" at the beginning of a Markdown file. */
  interface YamlNode extends Leaf { type: 'yaml' }

  /** Header (e.g. `<h1>`). */
  interface HeadingNode extends Parent {
    type: 'heading',
    depth: number,
  }

  /** Paragraph. */
  interface ParagraphNode extends Parent {
    type: 'paragraph'
  }

  /** Plain, unformatted text. */
  interface TextNode extends Leaf {
    type: 'text'
  }

  /** Link. */
  interface LinkNode extends Parent {
    type: 'link',
    title: string | null,
    url: string | null,
  }

  interface ListNode extends Parent {
    type: 'list',
    ordered: boolean,
    start: number | null,
  }

  interface ListItemNode extends Parent {
    type: 'listItem',
    loose: boolean,
    checked: boolean | null,
  }

  interface InlineCodeNode extends Leaf {
    type: 'inlineCode',
  }

  /** Generic AST node. */
  type Node
    = YamlNode
    | HeadingNode
    | ParagraphNode
    | TextNode
    | LinkNode
    | ListNode
    | ListItemNode
    | InlineCodeNode
}

declare module "remark-parse"

declare module "remark-stringify"

declare namespace unified {

  type Processor = {
    use: ProcessorCreator,
    parse: (source: string) => Remark.RootNode,
    stringify: (ast: Remark.Node) => string,
  }

  type ProcessorCreator = (...args: any[]) => Processor;

  function unified(...args: any[]): Processor;
}

declare module "unified" {
  export = unified.unified;
}

interface Array<T> {
    find(predicate: (search: T) => boolean) : T | void;
}
