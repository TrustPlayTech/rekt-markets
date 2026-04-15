import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  generateBuildId: async () => {
    return Date.now().toString()
  },
  typescript: {
    // Temporarily skip TS checks during build (OOM on 4GB VPS)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
