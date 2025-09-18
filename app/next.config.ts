import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
