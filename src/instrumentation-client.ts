import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/buda',
  ui_host: 'https://eu.i.posthog.com',
  capture_pageview: true,
  defaults: '2025-05-24',
})
