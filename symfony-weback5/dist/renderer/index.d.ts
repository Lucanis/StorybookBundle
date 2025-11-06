import { WebRenderer, ArgsStoryFn, Args, ComponentAnnotations, AnnotatedStoryFn, StoryAnnotations, StrictArgs, DecoratorFunction, LoaderFunction, StoryContext as StoryContext$1, ProjectAnnotations, NamedOrDefaultProjectAnnotations, NormalizedProjectAnnotations } from 'storybook/internal/types';
export { ArgTypes, Args, Parameters, StrictArgs } from 'storybook/internal/types';

declare class TwigTemplate {
    private readonly source;
    constructor(source: string);
    getSource(): string;
    toString(): string;
}

type TwigComponent = {
    hash: string;
    name: string;
};
interface SymfonyRenderer extends WebRenderer {
    component: TwigComponent | TwigTemplate | string | ArgsStoryFn<SymfonyRenderer> | undefined;
    storyResult: StoryFnSymfonyReturnType;
}
type StoryFnSymfonyReturnType = {
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

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/api/csf#default-export)
 */
type Meta<TArgs = Args> = ComponentAnnotations<SymfonyRenderer, TArgs>;
/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/api/csf#named-story-exports)
 */
type StoryFn<TArgs = Args> = AnnotatedStoryFn<SymfonyRenderer, TArgs>;
/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/api/csf#named-story-exports)
 */
type StoryObj<TArgs = Args> = StoryAnnotations<SymfonyRenderer, TArgs>;
type Decorator<TArgs = StrictArgs> = DecoratorFunction<SymfonyRenderer, TArgs>;
type Loader<TArgs = StrictArgs> = LoaderFunction<SymfonyRenderer, TArgs>;
type StoryContext<TArgs = StrictArgs> = StoryContext$1<SymfonyRenderer, TArgs>;
type Preview = ProjectAnnotations<SymfonyRenderer>;

/**
 * Function that sets the globalConfig of your storybook. The global config is the preview module of
 * your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your
 * stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *
 * ```jsx
 * // setup-file.js
 * import { setProjectAnnotations } from '@storybook/preact';
 * import projectAnnotations from './.storybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 * ```
 *
 * @param projectAnnotations - E.g. (import projectAnnotations from '../.storybook/preview')
 */
declare function setProjectAnnotations(projectAnnotations: NamedOrDefaultProjectAnnotations<any> | NamedOrDefaultProjectAnnotations<any>[]): NormalizedProjectAnnotations<SymfonyRenderer>;

export { type Decorator, type Loader, type Meta, type Preview, type StoryContext, type StoryFn, type StoryObj, type SymfonyRenderer, setProjectAnnotations };
