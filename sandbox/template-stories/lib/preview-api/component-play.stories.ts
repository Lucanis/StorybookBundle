import { global as globalThis } from "@storybook/global";
import type { StoryContext } from "@sensiolabs/storybook-symfony-webpack5";
import type { PartialStoryFn } from "storybook/internal/types";
import { within, expect } from "storybook/test";

export default {
  component: globalThis.Components.Pre,
  play: async ({ canvasElement, name }: StoryContext) => {
    await expect(
      JSON.parse(
        within(canvasElement as HTMLPreElement).getByTestId("pre").innerText
      )
    ).toEqual({
      name,
    });
  },
  // Render the story name into the Pre
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => {
      const { name } = context;
      return storyFn({ args: { object: { name } } });
    },
  ],
};

export const StoryOne = {};
export const StoryTwo = {};
