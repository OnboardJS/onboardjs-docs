import { Callout } from '@/components/callout'
import { QuickLink, QuickLinks } from '@/components/quick-links'
import { SupabaseIcon, PosthogIcon, MixpanelIcon, OnboardJSIcon } from '@/components/icons'
import { Link } from '@/components/link'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'supabase-icon': {
    selfClosing: true,
    render: SupabaseIcon,
    attributes: {
      height: { type: String, default: '24px' },
      width: { type: String, default: 'auto' },
      className: { type: String, default: '' },
    },
  },
  'posthog-icon': {
    selfClosing: true,
    render: PosthogIcon,
    attributes: {
      height: { type: String, default: '24px' },
      width: { type: String, default: 'auto' },
      className: { type: String, default: '' },
    },
  },
  'mixpanel-icon': {
    selfClosing: true,
    render: MixpanelIcon,
    attributes: {
      height: { type: String, default: '24px' },
      width: { type: String, default: 'auto' },
      className: { type: String, default: '' },
    },
  },
  'onboardjs-logo': {
    selfClosing: true,
    render: OnboardJSIcon,
    attributes: {
      height: { type: String, default: '24px' },
      width: { type: String, default: 'auto' },
      className: { type: String, default: '' },
    },
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  link: {
    render: Link,
    description: 'Displays a Next.js link',
    attributes: {
      href: {
        description: 'The path or URL to navigate to.',
        type: String,
        errorLevel: 'critical',
        required: true,
      },
      as: {
        description:
          'Optional decorator for the path that will be shown in the browser URL bar.',
        type: String,
      },
      passHref: {
        description: 'Forces Link to send the href property to its child.',
        type: Boolean,
        default: false,
      },
      prefetch: {
        description: 'Prefetch the page in the background.',
        type: Boolean,
      },
      replace: {
        description:
          'Replace the current history state instead of adding a new url into the stack.',
        type: Boolean,
        default: false,
      },
      scroll: {
        description: 'Scroll to the top of the page after a navigation.',
        type: Boolean,
        default: true,
      },
      shallow: {
        description:
          'Update the path of the current page without rerunning getStaticProps, getServerSideProps or getInitialProps.',
        type: Boolean,
        default: true,
      },
      locale: {
        description: 'The active locale is automatically prepended.',
        type: Boolean,
      },
      target: {
        description:
          'HTML attribute anchor target ("_self", "_blank", "_parent", "_top")',
        type: String,
      },
    },
  },
}

export default tags
