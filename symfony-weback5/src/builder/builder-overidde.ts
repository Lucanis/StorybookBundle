import * as baseBuilder from "@storybook/builder-webpack5";
import { legacyCreateProxyMiddleware } from "http-proxy-middleware";
import dedent from "ts-dedent";

export type BuilderOptions = baseBuilder.BuilderOptions & {
  storybookCachePath?: string;
  server?: string;
  proxyPaths?: string | string[];
};

export const start: typeof baseBuilder.start = async (options) => {
  const isProd = options.options.configType === "PRODUCTION";

  const { symfony } = await options.options.presets.apply<{
    symfony: BuilderOptions;
  }>("frameworkOptions");

  if (!symfony.server) {
    throw new Error(dedent`
        Cannot configure dev server.
        
        "server" option in "framework.options.symfony" is required for Storybook dev server to run.
        Update your main.ts|js file accordingly.
        `);
  }

  const proxyPaths = ["/_storybook/render"];

  if (symfony.proxyPaths) {
    const paths = !Array.isArray(symfony.proxyPaths)
      ? [symfony.proxyPaths]
      : symfony.proxyPaths;
    proxyPaths.push(...paths);
  }

  for (const path of proxyPaths) {
    options.router.use(
      path,
      legacyCreateProxyMiddleware({
        target: symfony.server,
        changeOrigin: true,
        secure: isProd,
        headers: {
          "X-Storybook-Proxy": "true",
        },
      })
    );
  }

  return baseBuilder.start(options);
};
