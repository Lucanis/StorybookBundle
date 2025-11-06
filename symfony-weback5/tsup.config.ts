import { defineConfig, type Options } from "tsup";

export default defineConfig(async () => {
  const commonConfig: Options = {
    clean: false,
    format: ["esm"],
    treeshake: true,
    splitting: true,
    external: [],
  };

  const configs: Options[] = [];

  // framework
  configs.push({
    ...commonConfig,
    entry: ["./src/index.ts"],
    platform: "browser",
    target: "esnext",
    dts: true,
  });

  configs.push({
    ...commonConfig,
    entry: ["./src/preset.ts"],
    platform: "node",
    target: "node22",
  });

  configs.push({
    ...commonConfig,
    entry: ["./src/node/index.ts"],
    outDir: "./dist/node",
    platform: "node",
    target: "node22",
    dts: true,
  });

  // preset-server
  configs.push({
    ...commonConfig,
    entry: ["./src/preset-server/index.ts"],
    outDir: "./dist/preset-server",
    platform: "node",
    target: "node22",
    dts: true,
  });

  // renderer
  configs.push({
    ...commonConfig,
    entry: ["./src/renderer/index.ts"],
    outDir: "./dist/renderer",
    dts: true,
  });
  configs.push({
    ...commonConfig,
    entry: [
      "./src/renderer/entry-preview.ts",
      "./src/renderer/entry-preview-docs.ts",
    ],
    outDir: "./dist/renderer",
  });

  configs.push({
    ...commonConfig,
    entry: ["./src/renderer/preset.ts"],
    outDir: "./dist/renderer",
    platform: "node",
    target: "node22",
  });

  // builder
  configs.push({
    ...commonConfig,
    entry: ["./src/builder/index.ts"],
    outDir: "./dist/builder",
    platform: "node",
    target: "node22",
    dts: true,
  });

  return configs;
});
