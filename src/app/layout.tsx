import { type Metadata } from 'next'
import clsx from 'clsx'

import { Layout } from '@/components/app-layout'
import { Lexend } from 'next/font/google'
const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
})

import '@/styles/tailwind-docs.css'
import { Providers } from './providers'


export const metadata: Metadata = {
  title: {
    template: '%s - Docs',
    default: 'OnboardJS - Docs - Build Better Onboarding',
  },
  description:
    'OnboardJS is an open-source, headless onboarding framework for React and Next.js. Easily create customizable, dynamic onboarding flows with full control over UI and user experience. Designed for modern web developers, OnboardJS offers flexible step logic, seamless integration, and persistent progress—empowering you to boost user activation and retention in your web app.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', lexend.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full bg-white dark:bg-slate-900">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
