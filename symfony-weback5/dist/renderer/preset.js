import { fileURLToPath } from 'url';

// src/renderer/preset.ts
var previewAnnotations = async (input = [], options) => {
  const [docsConfig] = await Promise.all([
    options.presets.apply("docs", {}, options)
  ]);
  const docsEnabled = Object.keys(docsConfig).length > 0;
  const result = [];
  return result.concat(input).concat([
    fileURLToPath(
      import.meta.resolve("symfony-webpack5/renderer/entry-preview")
    )
  ]).concat(
    docsEnabled ? [
      fileURLToPath(
        import.meta.resolve(
          "symfony-webpack5/renderer/entry-preview-docs"
        )
      )
    ] : []
  );
};

export { previewAnnotations };
