import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        path: false,
        stream: false,
        constants: false,
      };
    }
    return config;
  },
};

export default nextConfig;
