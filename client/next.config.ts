import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, // disable experimental React compiler for stability
  transpilePackages: ["recharts"], // ensure recharts is transpiled by webpack
};

export default nextConfig;
