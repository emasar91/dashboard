import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // Esto usa un código 308 para SEO
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emasar-telegram-clone.vercel.app",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
