/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
