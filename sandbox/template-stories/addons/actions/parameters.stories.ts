import { global as globalThis } from "@storybook/global";

export default {
  component: globalThis.Components.Button,
  args: {
    label: "Click Me!",
  },
  parameters: {
    chromatic: { disable: true },
  },
};

export const Basic = {
  parameters: {
    handles: [{ click: "clicked", contextmenu: "right clicked" }],
  },
};
