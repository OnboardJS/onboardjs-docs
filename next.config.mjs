import withMarkdoc from '@markdoc/next.js'
import withSearch from './src/markdoc/search.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/buda/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/buda/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/buda/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

export default withSearch(
  withMarkdoc({ schemaPath: './src/markdoc' })(nextConfig),
)
