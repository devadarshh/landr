import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  // Add webpack configuration for better module resolution
  webpack: (config) => {
    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Ensure proper module resolution
    config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

    return config;
  },
};

export default nextConfig;
