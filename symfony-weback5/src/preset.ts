import { fileURLToPath } from "node:url";

import type { PresetProperty } from "storybook/internal/types";

export const addons: PresetProperty<"addons"> = [
  fileURLToPath(import.meta.resolve("symfony-webpack5/preset-server")),
];

export const core: PresetProperty<"core"> = async (config, options) => {
  const framework = await options.presets.apply("framework");

  return {
    ...config,
    builder: {
      name: fileURLToPath(import.meta.resolve("symfony-webpack5/builder")),
      options:
        typeof framework === "string" ? {} : framework.options.builder || {},
    },
    renderer: fileURLToPath(
      import.meta.resolve("symfony-webpack5/renderer/preset")
    ),
  };
};
