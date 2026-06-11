import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['pseventmanager.netlify.app'],
    }
  }
};

export default nextConfig;
