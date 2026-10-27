import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  analyzerMode: 'static',
  openAnalyzer: false,
  logLevel: 'info',
});

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default withBundleAnalyzer(nextConfig);
