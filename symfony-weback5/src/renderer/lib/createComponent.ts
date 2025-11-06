import type { Args } from "storybook/internal/types";

import { CALLBACK_ATTRIBUTE } from "./eventCallbacks";
import { twig } from "../twig";

export const createComponent = (name: string, args: Args) => {
  const processedArgs = Object.entries(args).reduce(
    (acc, [name, value]) => {
      if (typeof value === "function") {
        acc.callbacks.push(`{{ _context['${name}'] }}`);
      } else {
        acc.props.push(`:${name}="${name}"`);
      }

      return acc;
    },
    { props: [] as string[], callbacks: [] as string[] }
  );

  const argsAttributes = processedArgs.props;

  if (processedArgs.callbacks.length > 0) {
    argsAttributes.push(
      `${CALLBACK_ATTRIBUTE}="${processedArgs.callbacks.join(" ")}"`
    );
  }

  return twig`
        <twig:${name} ${argsAttributes.join(" ")} />
    `;
};
