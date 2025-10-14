import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi-Step Onboarding Example',
  description:
    'Discover a complete multi-step onboarding example with OnboardJS: Build engaging flows featuring a welcome screen and customizable persona selection. Learn to use the useOnboarding hook for seamless state management and navigation in your app. Perfect for developers!',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
