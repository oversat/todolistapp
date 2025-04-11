/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [192, 384],
    imageSizes: [192],
  },
};

module.exports = nextConfig;
