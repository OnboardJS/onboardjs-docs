import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Progress Component Example',
  description:
    'This example demonstrates how to use the Progress component to display the current progress of the onboarding process. The progress is updated based on the state of the onboarding flow.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
