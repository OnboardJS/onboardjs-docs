'use client'

import { Button } from '@/components/ui/button'
import { useOnboarding } from '@onboardjs/react'
import { ArrowRight, SparklesIcon } from 'lucide-react'
import Link from 'next/link'

export default function FirstStep() {
  const { next } = useOnboarding()

  return (
    <>
      <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <SparklesIcon className="text-primary animate-in fade-in zoom-in h-10 w-10 duration-300" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to KoolSaaS
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Unlock your tailored KoolSaaS experience!
        </p>
      </div>

      <div className="space-y-3">
        <Button size="lg" className="w-full font-semibold" onClick={() => next()}>
          Start Onboarding Experience
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Link href="https://onboardjs.com" target="_blank">
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            Go to Homepage
          </Button>
        </Link>
      </div>

      <div className="text-muted-foreground space-y-1 pt-4 text-xs">
        <p>✨ Built with Next.js</p>
        <p>🔧 Powered by OnboardJS</p>
        <p>🚀 Ready in minutes, not hours</p>
        <p>🧔 Perfect for teams</p>
      </div>
    </>
  )
}
