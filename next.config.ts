import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = withNextIntl()({
  // تجاهل أخطاء ESLint أثناء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // تجاهل أخطاء TypeScript أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // إعدادات الصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
})

export default nextConfig