import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Persona Select Example',
  description:
    'This is an example of how you can easily create more personalized onboarding experiences by allowing users to select their role or persona.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
