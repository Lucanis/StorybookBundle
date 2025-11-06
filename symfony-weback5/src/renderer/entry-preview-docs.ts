import type { DecoratorFunction } from "storybook/internal/types";

import type { SymfonyRenderer } from "./types";
import { SourceType } from "storybook/internal/docs-tools";
import { sourceDecorator } from "./docs/sourceDecorator";

export const decorators: DecoratorFunction<SymfonyRenderer>[] = [
  sourceDecorator,
];

export const parameters = {
  docs: {
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: "html",
      code: undefined,
      excludeDecorators: undefined,
    },
  },
};
