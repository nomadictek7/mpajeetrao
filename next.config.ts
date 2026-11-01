import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Impact and Journey are now sections of the About page.
  async redirects() {
    return [
      { source: "/impact", destination: "/about#impact", permanent: true },
      { source: "/journey", destination: "/about#journey", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        // Only our own CSS: running Tailwind over next/font's generated CSS breaks its font URLs on Vercel builds.
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
