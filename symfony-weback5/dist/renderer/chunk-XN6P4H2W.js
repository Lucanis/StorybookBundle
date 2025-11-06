import { logger } from 'storybook/internal/client-logger';

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

export { ACTION_ATTRIBUTE, CALLBACK_ATTRIBUTE, dedent, esm_default, setupEventCallbacks };
