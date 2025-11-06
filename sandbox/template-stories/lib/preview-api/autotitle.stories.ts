import { global as globalThis } from "@storybook/global";
import { expect } from "storybook/test";
import type { StoryContext } from "@sensiolabs/storybook-symfony-webpack5";

export default {
  component: globalThis.Components.Pre,
  args: { text: "No content" },
};

export const Default = {
  play: async ({ title }: StoryContext) => {
    await expect(title).toBe("lib/preview-api/autotitle");
  },
};
