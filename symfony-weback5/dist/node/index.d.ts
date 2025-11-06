import { CompatibleString } from 'storybook/internal/types';
import { StorybookConfigWebpack, BuilderOptions, TypescriptOptions } from '@storybook/builder-webpack5';
import { WebpackConfiguration, StorybookConfig as StorybookConfig$2 } from '@storybook/core-webpack';

type ProxyPaths = string[] | string;
type SymfonyOptions = {
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
type StorybookConfig$1<TWebpackConfiguration = WebpackConfiguration> = StorybookConfig$2<TWebpackConfiguration>;

type FrameworkName = CompatibleString<"symfony-webpack5">;
type BuilderName = CompatibleString<"symfony-webpack5/builder">;
type FrameworkOptions = {
    builder?: BuilderOptions;
    symfony: SymfonyOptions;
};
type StorybookConfigFramework = {
    framework: FrameworkName | {
        name: FrameworkName;
        options: FrameworkOptions;
    };
    core?: StorybookConfig$1["core"] & {
        builder?: BuilderName | {
            name: BuilderName;
            options: BuilderOptions;
        };
    };
    typescript?: Partial<TypescriptOptions> & StorybookConfig$1["typescript"];
};
/** The interface for Storybook configuration in `main.ts` files. */
type StorybookConfig = Omit<StorybookConfig$1, keyof StorybookConfigWebpack | keyof StorybookConfigFramework> & StorybookConfigWebpack & StorybookConfigFramework;

declare function defineMain(config: StorybookConfig): StorybookConfig;

export { defineMain };
