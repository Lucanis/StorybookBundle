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
      directory: "../template-stories/lib/preview-api",
      titlePrefix: "lib/preview-api",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/links",
      titlePrefix: "addons/links",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/actions",
      titlePrefix: "addons/actions",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/backgrounds",
      titlePrefix: "addons/backgrounds",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/controls",
      titlePrefix: "addons/controls",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/docs",
      titlePrefix: "addons/docs",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/toolbars",
      titlePrefix: "addons/toolbars",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/viewport",
      titlePrefix: "addons/viewport",
      files: "**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    },
    {
      directory: "../template-stories/addons/interactions",
      titlePrefix: "addons/interactions",
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
        server: "http://localhost:8000",
        proxyPaths: ["/assets", "/_components"],
        additionalWatchPaths: ["assets"],
      },
    },
  },
  previewAnnotations: [
    "./templates/components/Storybook",
    "./template-stories/lib/preview-api/preview.ts",
    "./template-stories/addons/toolbars/preview.ts",
  ],
};

export default config;
