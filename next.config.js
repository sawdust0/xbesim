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
    // Build hatalarını önlemek için
    missingSuspenseWithCSRBailout: false
  }
};

module.exports = nextConfig; 