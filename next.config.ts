import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR ?? ".next-build",
  experimental: {
    cpus: 1,
    webpackBuildWorker: true,
  },
};

export default nextConfig;
