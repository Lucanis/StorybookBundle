// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import "dotenv/config";
import type { StorybookConfig } from "@sensiolabs/storybook-symfony-webpack5";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    {
      directory: "../templates/components",
      titlePrefix: "symfony",
      files: "**/*.@(mdx|stories.@(js|ts))",
    },
    {
      directory: "../stories",
      titlePrefix: "stories",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@sensiolabs/storybook-symfony-webpack5",
    options: {
      // 👇 Here configure the framework
      symfony: {
        storybookCachePath: `var/cache/${process.env.APP_ENV}/storybook`,
        server: "http://localhost:8001",
        proxyPaths: ["/assets", "/_components"],
        additionalWatchPaths: ["assets"],
      },
    },
  },
  previewAnnotations: [
    "./templates/components/Storybook",
    "./stories/preview.ts",
  ],
};

export default config;
