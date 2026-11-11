import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["knex", "mysql2"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
