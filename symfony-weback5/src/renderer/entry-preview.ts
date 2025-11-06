import { ArgTypesEnhancer } from "storybook/internal/csf";
import { enhanceArgTypes } from "storybook/internal/docs-tools";
import { SymfonyRendererParameters } from "./types";

export { render, renderToCanvas } from "./render";

export const parameters: SymfonyRendererParameters = {
  renderer: "symfony",
  symfony: {},
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];
