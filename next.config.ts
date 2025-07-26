import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        hostname: 'placehold.co',
        pathname: '/**'
      },
      {
        hostname: 'api-bigboy.duthanhduoc.com',
        pathname: '/**'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
