/**
 * Next.js Configuration
 * Production-ready settings for Vercel deployment
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for pages that use server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
