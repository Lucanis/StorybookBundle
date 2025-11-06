import { global as globalThis } from "@storybook/global";
import type { StoryContext } from "@sensiolabs/storybook-symfony-webpack5";
import type { PartialStoryFn } from "storybook/internal/types";
import { within, expect } from "storybook/test";

export default {
  component: globalThis.Components.Pre,
  tags: ["component-one", "component-two", "autodocs"],
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => {
      return storyFn({
        args: { object: { tags: context.tags } },
      });
    },
  ],
  parameters: { chromatic: { disable: true } },
};

export const Inheritance = {
  tags: ["story-one"],
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await expect(JSON.parse(canvas.getByTestId("pre").innerText)).toEqual({
      tags: [
        "dev",
        "test",
        "component-one",
        "component-two",
        "autodocs",
        "story-one",
      ],
    });
  },
  parameters: { chromatic: { disable: false } },
};

export const DocsOnly = {
  tags: ["docs-only"],
};

export const TestOnly = {
  tags: ["test-only"],
};

export const DevOnly = {
  tags: ["dev-only"],
};

export const TagRemoval = {
  tags: ["!component-two"],
};
