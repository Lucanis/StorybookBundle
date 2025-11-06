import fs2 from 'fs';
import path, { join, resolve } from 'path';
import { createUnplugin } from 'unplugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { logger } from 'storybook/internal/node-logger';
import { JSDOM } from 'jsdom';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import isGlob from 'is-glob';
import { glob } from 'glob';
import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var SymfonyPreviewRenderingError = class extends Error {
  constructor(errorPage) {
    super("Unable to render preview.");
    this.errorPage = errorPage;
  }
};
var generateSymfonyPreview = async (server) => {
  const fetchUrl = new URL(`${server}/_storybook/preview`);
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      Accept: "text/html"
    }
  });
  const html = await response.text();
  if (!response.ok) {
    throw new SymfonyPreviewRenderingError(html);
  }
  return html;
};
var getSymfonyConfig = async (storybookCachePath) => {
  const filePath = resolve() + "/" + storybookCachePath + "/symfony_parameters.json";
  return JSON.parse(fs2.readFileSync(filePath, "utf8"));
};

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
var injectPreviewHtml = (previewHtml, targetHtml) => {
  const previewDom = new JSDOM(previewHtml);
  const previewHead2 = previewDom.window.document.head;
  const previewBody2 = previewDom.window.document.body;
  return targetHtml.replace("<!--PREVIEW_HEAD_PLACEHOLDER-->", previewHead2.innerHTML).replace("<!--PREVIEW_BODY_PLACEHOLDER-->", previewBody2.innerHTML);
};

// src/preset-server/lib/preview-compiler-plugin.ts
var PLUGIN_NAME = "preview-plugin";
var PreviewCompilerPlugin = createUnplugin((options) => {
  const { server } = options;
  return {
    name: PLUGIN_NAME,
    webpack(compiler) {
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapPromise(
          PLUGIN_NAME,
          async (params) => {
            try {
              const previewHtml = await generateSymfonyPreview(server);
              params.html = injectPreviewHtml(previewHtml, params.html);
              return params;
            } catch (err) {
              logger.error(esm_default`
                            Failed to inject Symfony preview template in main iframe.html.
                            ERR: ${err}
                            `);
              return params;
            }
          }
        );
      });
    }
  };
});
var computeAdditionalWatchPaths = (paths, baseDir) => {
  const result = {
    dirs: [],
    files: []
  };
  paths.forEach((watchPath) => {
    const absoluteWatchPath = join(baseDir, watchPath);
    if (isGlob(absoluteWatchPath)) {
      result.files.push(
        ...glob.sync(absoluteWatchPath, {
          dot: true,
          absolute: true
        })
      );
    } else if (fs2.existsSync(absoluteWatchPath)) {
      const stats = fs2.lstatSync(absoluteWatchPath);
      (stats.isDirectory() ? result.dirs : result.files).push(
        absoluteWatchPath
      );
    } else if (fs2.existsSync(watchPath)) {
      const stats = fs2.lstatSync(watchPath);
      (stats.isDirectory() ? result.dirs : result.files).push(watchPath);
    } else {
      logger.warn(esm_default`
                    Ignoring additional watch path '${watchPath}': path doesn't exists.
                `);
    }
  });
  return result;
};
var PLUGIN_NAME2 = "dev-preview-plugin";
var DevPreviewCompilerPlugin = createUnplugin((options) => {
  const { projectDir, server, additionalWatchPaths } = options;
  return {
    name: PLUGIN_NAME2,
    enforce: "post",
    transformInclude(id) {
      return /storybook-config-entry\.js$/.test(id);
    },
    async transform(code) {
      return esm_default`
        import { symfonyPreview } from './symfony-preview.js';
        
        ${code}

        window.__SYMFONY_PREVIEW__ = symfonyPreview;
        if (import.meta.webpackHot) {
            import.meta.webpackHot.accept('./symfony-preview.js', () => {
                const iframe = window.top.document.getElementById('storybook-preview-iframe');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            });
        }
        `;
    },
    webpack(compiler) {
      const v = new VirtualModulesPlugin();
      v.apply(compiler);
      let previewHtml = "";
      compiler.hooks.watchRun.tapPromise(PLUGIN_NAME2, async () => {
        previewHtml = await generateSymfonyPreview(server);
        v.writeModule(
          "./symfony-preview.js",
          esm_default`
                    export const symfonyPreview = {
                        html: \`${previewHtml}\`,
                    };`
        );
      });
      compiler.hooks.afterCompile.tap(PLUGIN_NAME2, (compilation) => {
        if ("HtmlWebpackCompiler" == compilation.name) {
          const resolvedWatchPaths = computeAdditionalWatchPaths(
            additionalWatchPaths,
            projectDir
          );
          compilation.contextDependencies.addAll(resolvedWatchPaths.dirs);
          compilation.fileDependencies.addAll(resolvedWatchPaths.files);
        }
      });
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME2, (compilation) => {
        HtmlWebpackPlugin.getHooks(
          compilation
        ).afterTemplateExecution.tapPromise(PLUGIN_NAME2, async (params) => {
          try {
            params.html = injectPreviewHtml(previewHtml, params.html);
            return params;
          } catch (err) {
            logger.error(esm_default`
                            Failed to inject Symfony preview template in main iframe.html.
                            ERR: ${err}
                            `);
            return params;
          }
        });
      });
    }
  };
});
var extractComponentsFromTemplate = (source) => {
  const reservedNames = ["block"];
  const tagRe = new RegExp(/twig:[A-Za-z]+(?::[A-Za-z]+)*/);
  const functionRe = new RegExp(/component\(\s*'([A-Za-z]+(?::[A-Za-z]+)*)'\s*(?:,.*)?\)/, "gs");
  const lookupComponents = (obj) => {
    return Object.entries(obj).reduce((names, [key, value]) => {
      if (value !== null && typeof value === "object") {
        names.push(...lookupComponents(value));
      } else if (typeof value === "string") {
        for (const m of value.matchAll(functionRe)) {
          names.push([...m][1]);
        }
      }
      if (tagRe.test(key)) {
        names.push(key.replace("twig:", ""));
      }
      return names;
    }, []);
  };
  try {
    const documentObj = new XMLParser().parse(`<div>${source}</div>`);
    return lookupComponents(documentObj).filter((name) => !reservedNames.includes(name));
  } catch (err) {
    throw new Error("Invalid XML.", {
      cause: {
        parserError: err,
        template: source
      }
    });
  }
};
var TwigComponentResolver = class {
  constructor(config, projectDir) {
    this.config = config;
    this.projectDir = projectDir;
  }
  resolveNameFromFile(file) {
    const stripDirectory = (file2, dir) => {
      return file2.replace(dir, "").replace(/^\//, "").replaceAll("/", ":").replace(".html.twig", "");
    };
    const resolvedFile = this.resolveRelativePath(file);
    for (const [namespace, twigDirectories] of Object.entries(
      this.config.namespaces
    )) {
      const matchingDirectory = twigDirectories.find(
        (dir) => resolvedFile.startsWith(dir)
      );
      if (matchingDirectory) {
        const trimmedPath = stripDirectory(resolvedFile, matchingDirectory);
        return namespace ? `${namespace}:${trimmedPath}` : trimmedPath;
      }
    }
    for (const anonymousDir of this.config.anonymousTemplateDirectory) {
      if (resolvedFile.startsWith(anonymousDir)) {
        return stripDirectory(resolvedFile, anonymousDir);
      }
    }
    throw new Error(
      esm_default`Unable to determine template name for file "${file}":`
    );
  }
  resolveFileFromName(name) {
    const nameParts = name.split(":");
    const namespace = nameParts.length > 1 ? nameParts[0] : "";
    const dirParts = nameParts.slice(0, -1);
    const filename = `${nameParts.slice(-1)}.html.twig`;
    const lookupPaths = [];
    if (namespace && this.config.namespaces[namespace]) {
      const namespacePaths = this.config.namespaces[namespace];
      if (namespacePaths.length > 0) {
        for (const namespacePath of this.config.namespaces[namespace]) {
          lookupPaths.push(
            path.join(
              this.resolveRelativePath(namespacePath),
              dirParts.slice(1).join("/")
            )
          );
        }
      }
    }
    if (this.config.namespaces[""] && this.config.namespaces[""].length > 0) {
      for (const namespacePath of this.config.namespaces[""]) {
        lookupPaths.push(
          path.join(this.resolveRelativePath(namespacePath), dirParts.join("/"))
        );
      }
    }
    if (this.config.anonymousTemplateDirectory.length > 0) {
      for (const namespacePath of this.config.anonymousTemplateDirectory) {
        lookupPaths.push(
          path.join(this.resolveRelativePath(namespacePath), dirParts.join("/"))
        );
      }
    }
    try {
      return __require.resolve(`./${filename}`, { paths: lookupPaths });
    } catch (err) {
      throw new Error(
        esm_default`Unable to find template file for component "${name}": ${err}`
      );
    }
  }
  /**
   * Remove the project path from the file path.
   * This is useful to have relative paths and not depend on host paths.
   */
  resolveRelativePath(file) {
    return file.replace(this.projectDir, "");
  }
};
var PLUGIN_NAME3 = "twig-loader";
var TwigLoaderPlugin = createUnplugin((options) => {
  const { twigComponentConfiguration, projectDir } = options;
  const resolver = new TwigComponentResolver(
    twigComponentConfiguration,
    projectDir
  );
  return {
    name: PLUGIN_NAME3,
    enforce: "pre",
    transformInclude: (id) => {
      return /\.html\.twig$/.test(id);
    },
    transform: async (code, id) => {
      const imports = [];
      try {
        const components = new Set(extractComponentsFromTemplate(code));
        components.forEach((name2) => {
          imports.push(resolver.resolveFileFromName(name2));
        });
      } catch (err) {
        logger.warn(esm_default`
                Failed to parse template in '${id}': ${err}
                `);
      }
      const name = resolver.resolveNameFromFile(id);
      return esm_default`
            ${imports.map((file) => `import '${file}';`).join("\n")}
            export default {
                name: \'${name}\',
                hash: \`${crypto.createHash("sha1").update(code).digest("hex")}\`,
            };
           `;
    }
  };
});

// src/preset-server/index.ts
var getBuildOptions = async (symfonyOptions) => {
  const { twig_config, twig_component_config } = await getSymfonyConfig(
    symfonyOptions.storybookCachePath
  );
  const componentNamespaces = {};
  const twigPaths = Object.keys(twig_config.paths);
  if (twigPaths.length === 0) {
    twigPaths.push("templates");
  }
  for (const {
    name_prefix: namePrefix,
    template_directory: templateDirectory
  } of Object.values(twig_component_config.defaults)) {
    componentNamespaces[namePrefix] = [
      join(twig_config.default_path, templateDirectory)
    ];
  }
  Object.entries(twig_config.paths).forEach(([path2, alias]) => {
    componentNamespaces[alias] = [
      join(path2, twig_component_config.anonymous_template_directory)
    ];
  });
  const anonymousNamespace = [
    join(
      twig_config.default_path,
      twig_component_config.anonymous_template_directory
    )
  ];
  return {
    twigComponent: {
      anonymousTemplateDirectory: anonymousNamespace,
      namespaces: componentNamespaces
    },
    twig: {
      paths: twigPaths
    },
    additionalWatchPaths: symfonyOptions.additionalWatchPaths || []
  };
};
var webpack = async (config, options) => {
  const framework = await options.presets.apply("framework");
  const frameworkOptions = typeof framework === "string" ? {} : framework.options;
  const symfonyOptions = await getBuildOptions(frameworkOptions.symfony);
  return {
    ...config,
    plugins: [
      ...config.plugins || [],
      ...[
        options.configType === "PRODUCTION" ? PreviewCompilerPlugin.webpack({
          server: frameworkOptions.symfony.server
        }) : DevPreviewCompilerPlugin.webpack({
          projectDir: resolve(),
          server: frameworkOptions.symfony.server,
          additionalWatchPaths: symfonyOptions.additionalWatchPaths
        }),
        TwigLoaderPlugin.webpack({
          projectDir: resolve(),
          twigComponentConfiguration: symfonyOptions.twigComponent
        })
      ]
    ],
    module: {
      ...config.module,
      rules: [...config.module?.rules || []]
    }
  };
};
var previewHead = async (base) => esm_default`
    ${base}
    <!--PREVIEW_HEAD_PLACEHOLDER-->
    `;
var previewBody = async (base) => esm_default`
    ${base}
    <!--PREVIEW_BODY_PLACEHOLDER-->
    `;

export { previewBody, previewHead, webpack };
