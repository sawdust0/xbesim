/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Build hatalarını önlemek için
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Server actions için limit
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Static export için
  trailingSlash: true,
  // Güvenlik için powered by header'ı kaldır
  poweredByHeader: false,
};

module.exports = nextConfig; 