import { WebpackConfiguration, StorybookConfig as StorybookConfig$1 } from '@storybook/core-webpack';
export { BuilderResult } from '@storybook/core-webpack';
import { PresetProperty } from 'storybook/internal/types';

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
type StorybookConfig<TWebpackConfiguration = WebpackConfiguration> = StorybookConfig$1<TWebpackConfiguration>;

declare const webpack: StorybookConfig["webpack"];
declare const previewHead: PresetProperty<"previewHead">;
declare const previewBody: PresetProperty<"previewBody">;

export { type StorybookConfig, type SymfonyOptions, previewBody, previewHead, webpack };
