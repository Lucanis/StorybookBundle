import { fileURLToPath } from "node:url";
import type { PresetProperty } from "storybook/internal/types";

export const previewAnnotations: PresetProperty<"previewAnnotations"> = async (
  input = [],
  options
) => {
  const [docsConfig] = await Promise.all([
    options.presets.apply("docs", {}, options),
  ]);
  const docsEnabled = Object.keys(docsConfig).length > 0;
  const result: string[] = [];

  return result
    .concat(input)
    .concat([
      fileURLToPath(
        import.meta.resolve("symfony-webpack5/renderer/entry-preview")
      ),
    ])
    .concat(
      docsEnabled
        ? [
            fileURLToPath(
              import.meta.resolve(
                "symfony-webpack5/renderer/entry-preview-docs"
              )
            ),
          ]
        : []
    );
};
