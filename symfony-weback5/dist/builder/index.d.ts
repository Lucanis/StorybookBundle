import * as baseBuilder from '@storybook/builder-webpack5';
export * from '@storybook/builder-webpack5';

declare const start: typeof baseBuilder.start;

export { start };
