import { global as globalThis } from "@storybook/global";
import type { StoryContext } from "@sensiolabs/storybook-symfony-webpack5";
import type { PartialStoryFn } from "storybook/internal/types";
import { within, expect } from "storybook/test";

export default {
  component: globalThis.Components.Pre,
  parameters: {
    componentParameter: "componentParameter",
    storyParameter: "componentStoryParameter", // Checking this gets overridden
    storyObject: {
      a: "component",
      b: "component",
    },
  },
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => {
      const {
        projectParameter,
        componentParameter,
        storyParameter,
        storyObject,
      } = context.parameters;
      return storyFn({
        args: {
          object: {
            projectParameter,
            componentParameter,
            storyParameter,
            storyObject,
          },
        },
      });
    },
  ],
};

export const Inheritance = {
  parameters: {
    storyParameter: "storyParameter",
    storyObject: {
      a: "story",
    },
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await expect(JSON.parse(canvas.getByTestId("pre").innerText)).toEqual({
      projectParameter: "projectParameter",
      componentParameter: "componentParameter",
      storyParameter: "storyParameter",
      storyObject: {
        a: "story",
        b: "component",
        c: "project",
      },
    });
  },
};
