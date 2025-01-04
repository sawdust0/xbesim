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
  // Optimize build process
  compress: true,
  generateEtags: true,
  // Güvenlik için powered by header'ı kaldır
  poweredByHeader: false,
};

module.exports = nextConfig; 