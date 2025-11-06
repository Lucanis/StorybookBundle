import { global } from '@storybook/global';
import { simulatePageLoad, simulateDOMContentLoaded, addons, setDefaultProjectAnnotations, setProjectAnnotations as setProjectAnnotations$1 } from 'storybook/preview-api';
import { enhanceArgTypes } from 'storybook/internal/docs-tools';
import { logger } from 'storybook/internal/client-logger';
import { STORY_ERRORED, STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events';
import { decode } from 'html-entities';

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var { window: globalWindow } = global;
if (globalWindow) {
  globalWindow.STORYBOOK_ENV = "symfony";
}

// src/renderer/entry-preview.ts
var entry_preview_exports = {};
__export(entry_preview_exports, {
  argTypesEnhancers: () => argTypesEnhancers,
  parameters: () => parameters,
  render: () => render,
  renderToCanvas: () => renderToCanvas
});

// node_modules/ts-dedent/esm/index.js
function dedent(templ) {
  var values = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    values[_i - 1] = arguments[_i];
  }
  var strings = Array.from(typeof templ === "string" ? [templ] : templ);
  strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var indentLengths = strings.reduce(function(arr, str) {
    var matches = str.match(/\n([\t ]+|(?!\s).)/g);
    if (matches) {
      return arr.concat(matches.map(function(match) {
        var _a, _b;
        return (_b = (_a = match.match(/[\t ]/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
      }));
    }
    return arr;
  }, []);
  if (indentLengths.length) {
    var pattern_1 = new RegExp("\n[	 ]{" + Math.min.apply(Math, indentLengths) + "}", "g");
    strings = strings.map(function(str) {
      return str.replace(pattern_1, "\n");
    });
  }
  strings[0] = strings[0].replace(/^\r?\n/, "");
  var string = strings[0];
  values.forEach(function(value, i) {
    var endentations = string.match(/(?:^|\n)( *)$/);
    var endentation = endentations ? endentations[1] : "";
    var indentedValue = value;
    if (typeof value === "string" && value.includes("\n")) {
      indentedValue = String(value).split("\n").map(function(str, i2) {
        return i2 === 0 ? str : "" + endentation + str;
      }).join("\n");
    }
    string += indentedValue + strings[i + 1];
  });
  return string;
}
var esm_default = dedent;
var CALLBACK_ATTRIBUTE = "data-storybook-callbacks";
var ACTION_ATTRIBUTE = "data-storybook-action";
var proxifyEvent = (e) => {
  if (e.currentTarget !== null && Object.hasOwn(e.currentTarget, "__component")) {
    const elementProxy = new Proxy(e.currentTarget, {
      ownKeys(target) {
        return Object.keys(target).filter((key) => key !== "__component");
      }
    });
    return new Proxy(e, {
      get(obj, key) {
        const value = Reflect.get(obj, key);
        return value === e.currentTarget ? elementProxy : value;
      }
    });
  }
  return e;
};
var setupEventCallbacks = (args, root) => {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      Object.entries(args).filter(([, arg]) => typeof arg === "function").forEach(([name, arg]) => {
        let el = root.querySelector(`[${CALLBACK_ATTRIBUTE}~='${name}']`);
        const isLegacyAttribute = el === null && null !== (el = root.querySelector(`[${ACTION_ATTRIBUTE}~='${name}']`));
        if (null !== el) {
          if (isLegacyAttribute) {
            logger.warn(esm_default`
                            Usage of attribute "${ACTION_ATTRIBUTE}" is deprecated. Use "${CALLBACK_ATTRIBUTE}" instead.
                            `);
          }
          el.addEventListener(name, (event) => arg(proxifyEvent(event)));
        } else {
          logger.warn(esm_default`
                        Callback arg "${name}" is not bound to any DOM element.
                    `);
        }
      });
    },
    { once: true }
  );
};

// src/renderer/twig/index.ts
var TwigTemplate = class {
  constructor(source) {
    this.source = source;
    this.source = source;
  }
  getSource() {
    return this.source;
  }
  toString() {
    return this.source;
  }
};
function twig(source, ...values) {
  const strings = typeof source === "string" ? [source] : source;
  const rawSource = String.raw({ raw: strings }, ...values);
  return new TwigTemplate(esm_default(rawSource));
}

// src/renderer/lib/createComponent.ts
var createComponent = (name, args) => {
  const processedArgs = Object.entries(args).reduce(
    (acc, [name2, value]) => {
      if (typeof value === "function") {
        acc.callbacks.push(`{{ _context['${name2}'] }}`);
      } else {
        acc.props.push(`:${name2}="${name2}"`);
      }
      return acc;
    },
    { props: [], callbacks: [] }
  );
  const argsAttributes = processedArgs.props;
  if (processedArgs.callbacks.length > 0) {
    argsAttributes.push(
      `${CALLBACK_ATTRIBUTE}="${processedArgs.callbacks.join(" ")}"`
    );
  }
  return twig`
        <twig:${name} ${argsAttributes.join(" ")} />
    `;
};
var extractErrorTitle = (html, fallback) => {
  const firstLine = html.split("\n", 1)[0];
  const matches = firstLine.match(/<!--\s*(.*)\s*-->$/);
  if (null === matches || matches.length < 2) {
    return fallback || "";
  }
  return decode(matches[1]);
};

// src/renderer/lib/buildStoryArgs.ts
var sanitizeArgs = (args) => {
  for (const name in args) {
    if (typeof args[name] === "function") {
      args[name] = name;
    } else if (typeof args[name] === "object" && null !== args[name]) {
      sanitizeArgs(args[name]);
    }
  }
};
var buildStoryArgs = (args, argTypes) => {
  const storyArgs = { ...args };
  Object.keys(argTypes).forEach((key) => {
    const argType = argTypes[key];
    const { control } = argType;
    const argValue = storyArgs[key];
    switch (control) {
      case "date":
        storyArgs[key] = new Date(argValue).toISOString();
        break;
    }
  });
  sanitizeArgs(storyArgs);
  return storyArgs;
};

// src/renderer/render.ts
var { fetch, Node } = global;
var SymfonyRenderingError = class extends Error {
  constructor(title, errorPage) {
    super(title);
    this.title = title;
    this.errorPage = errorPage;
  }
};
var fetchStoryHtml = async (url, path, params, storyContext, template) => {
  const fetchUrl = new URL(`${url}/${path}`);
  const body = {
    args: { ...storyContext.globals, ...params },
    template: template.getSource()
  };
  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/html"
    },
    body: JSON.stringify(body)
  });
  const html = await response.text();
  if (!response.ok) {
    const errorTitle = extractErrorTitle(html, response.statusText);
    throw new SymfonyRenderingError(errorTitle, html);
  }
  return html;
};
var render = (args, context) => {
  const { id, component } = context;
  if (typeof component === "string") {
    return {
      template: twig(component),
      setup: () => args
    };
  }
  if (typeof component === "object") {
    if ("getSource" in component && typeof component.getSource === "function") {
      return {
        template: component,
        setup: () => args
      };
    } else if ("name" in component) {
      return {
        template: createComponent(component.name, args),
        components: [component],
        setup: () => args
      };
    }
  }
  if (typeof component === "function") {
    return component(args, context);
  }
  logger.warn(dedent`
    Symfony renderer only supports rendering Twig templates. Either:
    - Create a "render" function in your story export
    - Set the "component" story's property to a string or a template created with the "twig" helper

    Received: ${component}
    `);
  throw new Error(`Unable to render story ${id}`);
};
async function renderToCanvas({
  id,
  title,
  name,
  showMain,
  showError,
  forceRemount,
  storyFn,
  storyContext,
  storyContext: { parameters: parameters2, args, argTypes }
}, canvasElement) {
  const { template, setup } = storyFn(storyContext);
  if (typeof setup === "function") {
    args = setup();
  }
  const storyArgs = buildStoryArgs(args, argTypes);
  const {
    symfony: { id: storyId, params }
  } = parameters2;
  const url = `${window.location.origin}/_storybook/render`;
  const fetchId = storyId || id;
  const storyParams = { ...params, ...storyArgs };
  showMain();
  try {
    const element = await fetchStoryHtml(
      url,
      fetchId,
      storyParams,
      storyContext,
      template
    );
    setupEventCallbacks(args, canvasElement);
    if (typeof element === "string") {
      canvasElement.innerHTML = element;
      configureLiveComponentErrorCatcher(id, canvasElement);
      simulatePageLoad(canvasElement);
    } else if (element instanceof Node) {
      if (canvasElement.firstChild === element && !forceRemount) {
        return;
      }
      canvasElement.innerHTML = "";
      canvasElement.appendChild(element);
      configureLiveComponentErrorCatcher(id, canvasElement);
      simulateDOMContentLoaded();
    } else {
      showError({
        title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${title}".`,
        description: dedent`
            Did you forget to return the HTML snippet from the story?
            Use "() => <your snippet or node>" or when defining the story.
          `
      });
    }
  } catch (err) {
    if (err instanceof SymfonyRenderingError) {
      showSymfonyError(id, canvasElement, err);
    } else {
      throw err;
    }
  }
}
var showSymfonyError = (storyId, canvasElement, error) => {
  const { title, errorPage } = error;
  logger.error(`Error rendering story ${storyId}: ${title}`);
  const channel = addons.getChannel();
  channel.emit(STORY_ERRORED, {
    title: storyId,
    description: `Server failed to render story:
${title}`
  });
  channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: "errored", storyId });
  canvasElement.innerHTML = errorPage;
  simulatePageLoad(canvasElement);
};
var configureLiveComponentErrorCatcher = (storyId, canvasElement) => {
  const liveComponentHosts = canvasElement.querySelectorAll(
    "[data-controller~=live]"
  );
  const errorHandler = async (response) => {
    const title = extractErrorTitle(await response.getBody());
    logger.error(
      `Live component failed to re-render in story ${storyId}: ${title}`
    );
    const channel = addons.getChannel();
    channel.emit(STORY_ERRORED, {
      title: storyId,
      description: `Live component failed to re-render:
${title}`
    });
  };
  liveComponentHosts.forEach(
    (el) => el.addEventListener("live:connect", () => {
      if ("__component" in el) {
        const component = el.__component;
        component.on("response:error", errorHandler);
      } else {
        logger.warn(dedent`
                    Failed to configure error handler for LiveComponent. The "__component" property is missing from the element. 
                    It's likely to be an issue with the Symfony Storybook framework. Check the concerned element below:
                    `);
        logger.warn(el);
      }
    })
  );
};

// src/renderer/entry-preview.ts
var parameters = {
  renderer: "symfony",
  symfony: {}
};
var argTypesEnhancers = [enhanceArgTypes];

// src/renderer/portable-stories.ts
function setProjectAnnotations(projectAnnotations) {
  setDefaultProjectAnnotations(entry_preview_exports);
  return setProjectAnnotations$1(
    projectAnnotations
  );
}

export { setProjectAnnotations };
