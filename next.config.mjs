/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // This allows importing package.json for version info
    config.module.rules.push({
      test: /package\.json$/,
      type: 'json',
    });
    return config;
  },
};

export default nextConfig;
