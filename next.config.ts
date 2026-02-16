import type { NextConfig } from 'next';

const configuredBasePath =
  (process.env.NEXT_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '')
    .trim()
    // ensure leading slash, remove trailing slashes
    .replace(/\/+$/, '');

const basePath =
  configuredBasePath && !configuredBasePath.startsWith('/')
    ? `/${configuredBasePath}`
    : configuredBasePath;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Serve the app and its /_next/static assets from a sub-path, e.g. /env00/api_003
  // Set at build time: NEXT_BASE_PATH=/env00/api_003
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
