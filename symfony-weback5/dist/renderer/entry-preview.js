import { dedent, setupEventCallbacks, esm_default, CALLBACK_ATTRIBUTE } from './chunk-XN6P4H2W.js';
import { enhanceArgTypes } from 'storybook/internal/docs-tools';
import { global } from '@storybook/global';
import { logger } from 'storybook/internal/client-logger';
import { simulatePageLoad, simulateDOMContentLoaded, addons } from 'storybook/preview-api';
import { STORY_ERRORED, STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events';
import { decode } from 'html-entities';

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

export { argTypesEnhancers, parameters, render, renderToCanvas };
