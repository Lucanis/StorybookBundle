import type { CompatibleString } from "storybook/internal/types";

import type {
  BuilderOptions,
  StorybookConfigWebpack,
  TypescriptOptions as TypescriptOptionsBuilder,
} from "@storybook/builder-webpack5";
import type {
  SymfonyOptions,
  StorybookConfig as StorybookConfigBase,
} from "./preset-server";

type FrameworkName = CompatibleString<"symfony-webpack5">;
type BuilderName = CompatibleString<"symfony-webpack5/builder">;

export type FrameworkOptions = {
  builder?: BuilderOptions;
  symfony: SymfonyOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase["core"] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: Partial<TypescriptOptionsBuilder> &
    StorybookConfigBase["typescript"];
};

/** The interface for Storybook configuration in `main.ts` files. */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigWebpack | keyof StorybookConfigFramework
> &
  StorybookConfigWebpack &
  StorybookConfigFramework;
