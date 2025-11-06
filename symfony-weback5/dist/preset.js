import { fileURLToPath } from 'url';

// src/preset.ts
var addons = [
  fileURLToPath(import.meta.resolve("symfony-webpack5/preset-server"))
];
var core = async (config, options) => {
  const framework = await options.presets.apply("framework");
  return {
    ...config,
    builder: {
      name: fileURLToPath(import.meta.resolve("symfony-webpack5/builder")),
      options: typeof framework === "string" ? {} : framework.options.builder || {}
    },
    renderer: fileURLToPath(
      import.meta.resolve("symfony-webpack5/renderer/preset")
    )
  };
};

export { addons, core };
