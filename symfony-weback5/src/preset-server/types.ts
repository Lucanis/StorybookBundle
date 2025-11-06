import type {
  StorybookConfig as StorybookConfigBase,
  WebpackConfiguration as WebpackConfigurationBase,
} from "@storybook/core-webpack";

export type { BuilderResult } from "@storybook/core-webpack";

type ProxyPaths = string[] | string;

export type SymfonyOptions = {
  /**
   * Storybook cache directory.
   */
  storybookCachePath: string;

  /**
   * Symfony server URL.
   */
  server?: string;

  /**
   * Paths to proxy to the Symfony server. This is useful to resolve assets (i.e. with '/assets').
   */
  proxyPaths?: ProxyPaths;

  /**
   * Additional paths to watch during compilation.
   */
  additionalWatchPaths?: string[];
};

export type StorybookConfig<TWebpackConfiguration = WebpackConfigurationBase> =
  StorybookConfigBase<TWebpackConfiguration>;
