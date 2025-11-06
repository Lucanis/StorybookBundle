import { CALLBACK_ATTRIBUTE, ACTION_ATTRIBUTE } from './chunk-XN6P4H2W.js';
import { SourceType, SNIPPET_RENDERED } from 'storybook/internal/docs-tools';
import { useEffect, addons } from 'storybook/preview-api';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// src/renderer/docs/buildVariableDeclarations.ts
var validArg = (value) => typeof value !== "function";
var isObject = (value) => typeof value === "object" && null !== value && !Array.isArray(value);
var indent = (level) => "    ".repeat(level);
var formatValue = (value, level = 0) => {
  if (null === value) {
    return "null";
  } else if (void 0 === value) {
    return "null";
  } else if (typeof value === "string") {
    return `'${value}'`;
  } else if (typeof value === "number") {
    return `${value}`;
  } else if (typeof value === "boolean") {
    return value ? "true" : "false";
  } else if (isObject(value)) {
    if (Object.keys(value).length === 0) {
      return "{}";
    }
    const objectDefinition = Object.entries(value).filter((v) => validArg(v[1])).map(([key, v]) => {
      return `${indent(level + 1)}'${key}': ${formatValue(v, level + 1)}`;
    });
    if (objectDefinition.length === 0) {
      return false;
    }
    return ["{", objectDefinition.join(",\n"), `${indent(level)}}`].join("\n");
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const arrayDefinition = value.filter((v) => validArg(v)).map((v) => {
      return `${indent(level + 1)}${formatValue(v, level + 1)}`;
    });
    if (arrayDefinition.length === 0) {
      return false;
    }
    return ["[", arrayDefinition.join(",\n"), `${indent(level)}]`].join("\n");
  } else {
    console.error("Unhandled value", value);
    throw new Error(`Unhandled type: ${typeof value}`);
  }
};
var buildVariableDeclarations = (args) => {
  const varDeclarations = Object.entries(args).filter(([, value]) => validArg(value)).map(([name, value]) => [name, formatValue(value)]).filter(([, value]) => false !== value).map(([name, value]) => `{% set ${name} = ${value} %}`);
  return varDeclarations.join("\n");
};
var STRIPPED_ATTRIBUTES = [CALLBACK_ATTRIBUTE, ACTION_ATTRIBUTE];
var isAttributeName = (name) => {
  return isLitAttributeName(name) || isExprAttributeName(name);
};
var isLitAttributeName = (name) => {
  return /^@_[^:]/.test(name);
};
var isExprAttributeName = (name) => {
  return /^@_:/.test(name);
};
var isTextName = (name) => {
  return /^#/.test(name);
};
var isNodeName = (name) => {
  return !isAttributeName(name) && !isTextName(name);
};
var getAttributeName = (name) => {
  if (isExprAttributeName(name)) {
    return name.replace(/^@_:/, "");
  }
  if (isLitAttributeName(name)) {
    return name.replace(/^@_/, "");
  }
  throw new Error("Invalid argument");
};
var traverseNode = (node) => {
  if (typeof node !== "string") {
    for (const child in node) {
      if (isAttributeName(child)) {
        const attrName = getAttributeName(child);
        if (STRIPPED_ATTRIBUTES.includes(attrName)) {
          delete node[child];
          continue;
        }
      }
      if (isNodeName(child)) {
        traverseNode(node[child]);
      }
    }
  }
};
var sanitize = (source) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    stopNodes: ["*.pre", "*.script"],
    unpairedTags: ["hr", "br", "link", "meta"],
    processEntities: true,
    htmlEntities: true,
    preserveOrder: true,
    allowBooleanAttributes: true
  });
  const xml = parser.parse(source);
  traverseNode(xml);
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: false,
    format: true,
    suppressEmptyNode: true,
    preserveOrder: true,
    suppressBooleanAttributes: true
  });
  return builder.build(xml).trim();
};

// src/renderer/docs/sourceDecorator.ts
function skipSourceRender(context) {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }
  return !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE;
}
var sourceDecorator = (storyFn, context) => {
  const story = storyFn();
  const setup = story.setup;
  let source;
  if (!skipSourceRender(context)) {
    source = story.template.getSource();
  }
  useEffect(() => {
    const { id, unmappedArgs } = context;
    if (source) {
      source = sanitize(source);
      const args = setup ? setup() : unmappedArgs;
      const preamble = buildVariableDeclarations(args);
      source = `${preamble}

${source}`;
      addons.getChannel().emit(SNIPPET_RENDERED, { id, args: unmappedArgs, source });
    }
  });
  return story;
};

// src/renderer/entry-preview-docs.ts
var decorators = [
  sourceDecorator
];
var parameters = {
  docs: {
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: "html",
      code: void 0,
      excludeDecorators: void 0
    }
  }
};

export { decorators, parameters };
