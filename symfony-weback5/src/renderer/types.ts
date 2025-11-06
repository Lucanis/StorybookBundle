import { SourceType } from "storybook/internal/docs-tools";
import type {
  ArgsStoryFn,
  WebRenderer,
  StoryContext as DefaultStoryContext,
  StoryId,
} from "storybook/internal/types";
import { TwigTemplate } from "./twig";

export type { RenderContext } from "storybook/internal/types";

export type TwigComponent = {
  hash: string;
  name: string;
};

export type SymfonyRendererParameters = {
  renderer: "symfony";
  symfony: {};
  docs?: {
    story: { inline: boolean };
    source: {
      type: SourceType.DYNAMIC;
      language: "html";
      code: any;
      excludeDecorators: any;
    };
  };
};

export interface SymfonyRenderer extends WebRenderer {
  component:
    | TwigComponent
    | TwigTemplate
    | string
    | ArgsStoryFn<SymfonyRenderer>
    | undefined;
  storyResult: StoryFnSymfonyReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnSymfonyReturnType = {
  /**
   * The Twig template to render.
   */
  template: TwigTemplate;
  /**
   * A function that returns args for the story.
   * May be used to pre-process args using loaders.
   */
  setup?: () => any;
  /**
   * A list of components used in this story.
   * Providing components here enables HMR in dev.
   */
  components?: TwigComponent[];
};

export type StoryContext = DefaultStoryContext<SymfonyRenderer> & {
  parameters: DefaultStoryContext<SymfonyRenderer>["parameters"] &
    SymfonyRendererParameters;
};
