export const navigation = [
  {
    title: 'Introduction',
    links: [
      { title: 'Getting started', href: '/' },
      { title: 'Installation', href: '/installation' },
    ],
  },
  {
    title: 'Core concepts',
    links: [
      { title: 'What is OnboardJS?', href: '/what-is-onboardjs' },
      { title: 'Onboarding config', href: '/onboarding-config' },
      {
        title: 'Defining steps',
        href: '/steps/defining-steps',
      },
      {
        title: 'Typed steps',
        href: '/steps/typed-steps',
      },
      { title: 'Onboarding Context', href: '/onboarding-context' },
      {
        title: 'Navigation & Flow',
        href: '/navigation-and-flow',
      },
      { title: 'Event System', href: '/event-system' },
      { title: 'Persistence', href: '/persistence' },
    ],
  },
  // {
  //   title: 'Advanced concepts',
  //   links: [{ title: 'Versioning', href: '/advanced/versioning' }],
  // },
  {
    title: 'UI Components',
    links: [
      { title: 'Overview', href: '/ui/overview' },
      { title: 'Progress', href: '/ui/progress' },
      { title: 'Persona Select', href: '/ui/persona-select' },
      { title: 'Multi-step Flow', href: '/ui/multi-step' },
    ],
  },
  {
    title: 'React',
    links: [
      { title: 'Overview', href: '/react/overview' },
      { title: 'Onboarding Provider', href: '/react/onboarding-provider' },
      { title: 'useOnboarding Hook', href: '/react/use-onboarding-hook' },
      { title: 'Render step content', href: '/react/render-step-content' },
      { title: 'Examples & Recipes', href: '/react/examples' },
    ],
  },
  {
    title: 'Next.js',
    links: [{ title: 'Overview', href: '/nextjs/overview' }],
  },
  {
    title: 'Plugins & Integrations',
    links: [
      { title: 'Overview', href: '/plugins/overview' },
      { title: 'Supabase', href: '/plugins/supabase' },
      { title: 'PostHog', href: '/plugins/posthog' },
    ],
  },
  // {
  //   title: 'Cookbook / Recipes',
  //   links: [
  //     {
  //       title: 'Understanding Your Onboarding Funnel',
  //       href: '/cookbook/posthog-funnel',
  //     },
  //   ],
  // },
  {
    title: 'Demos',
    links: [
      {
        title: 'Linear.app Demo',
        href: 'https://vite.onboardjs.com',
        target: '_blank',
      },
      {
        title: 'Basic Demo',
        href: 'https://demo.onboardjs.com',
        target: '_blank',
      },
      {
        title: 'Basecoat',
        href: 'https://basecoat.onboardjs.com',
        target: '_blank',
      },
    ],
  },
  // {
  //   title: 'API reference',
  //   links: [
  //     { title: 'CacheAdvance.predict()', href: '/cacheadvance-predict' },
  //     { title: 'CacheAdvance.flush()', href: '/cacheadvance-flush' },
  //     { title: 'CacheAdvance.revert()', href: '/cacheadvance-revert' },
  //     { title: 'CacheAdvance.regret()', href: '/cacheadvance-regret' },
  //   ],
  // },
  // {
  //   title: 'Contributing',
  //   links: [
  //     { title: 'How to contribute', href: '/how-to-contribute' },
  //     { title: 'Architecture guide', href: '/architecture-guide' },
  //     { title: 'Design principles', href: '/design-principles' },
  //   ],
  // },
]

export const getNavigationForSitemap = () => {
  return (
    navigation
      // Filter out any links that are not relevant for the sitemap
      .filter((section) => section.links.length > 0)
      .flatMap((section) =>
        section.links
          .filter((link) => link.href && !link.href.startsWith('http'))
          .map((link) => ({
            title: link.title,
            href: link.href,
          })),
      )
  )
}
