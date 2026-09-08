/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // The build-info/route-info overlay button is dev-only noise on top of the
  // editor canvas (it floats over the same corner as canvas selection UI) —
  // off in every environment, not just production.
  devIndicators: false,
  // The generated standalone block files (packages/cms-blocks/dist/standalone)
  // are read at runtime via a dynamic, block-id-parameterized path (any of
  // the 38 blocks can be inserted into a site), which Next's static file
  // tracer can't detect on its own — without this, a standalone/production
  // build silently omits @openforge/cms-blocks entirely and site creation
  // fails at runtime with no build-time warning.
  outputFileTracingIncludes: {
    "/**": [
      "../../packages/cms-blocks/dist/standalone/**",
      "../../packages/cms-blocks/src/blocks.css",
    ],
  },
};

export default nextConfig;
