import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next-build",
  experimental: {
    cpus: 1,
    webpackBuildWorker: true,
  },
};

export default nextConfig;
