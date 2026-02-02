import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { Link } from './link'

export function SkillPromoBanner() {
  return (
    <div className="not-prose bg-linear-to-br relative my-12 overflow-hidden rounded-2xl from-sky-50 via-slate-50 to-indigo-50 p-8 ring-1 ring-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:ring-white/10">
      {/* Background decorations */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-linear-to-r border-0 from-sky-500 to-indigo-500 px-3 py-1 text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            NEW
          </Badge>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            skills.sh Integration
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Build faster{' '}
          <span className="bg-linear-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400">
            with OnboardJS expertise
          </span>
        </h3>

        {/* Description */}
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Install the{' '}
          <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-sky-600 dark:bg-slate-700/50 dark:text-sky-300">
            onboardjs-react
          </code>{' '}
          skill from skills.sh and use it in Claude Code, Cursor, Windsurf,
          Cline, or any AI assistant that supports skills. Get instant guidance,
          code generation, and best practices for building onboarding flows.
        </p>

        {/* Usage */}
        <div className="mt-8">
          <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Works with your favorite AI coding tool:
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm ring-1 ring-slate-200 dark:bg-slate-800/80 dark:ring-white/10">
            <span className="text-slate-400 dark:text-slate-500">$</span>
            <span className="text-sky-600 dark:text-sky-300">
              /onboardjs-react
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              help me create a multi-step onboarding wizard
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link
            trackEvent="skill_sh_cta_click"
            href="https://skills.sh/onboardjs/onboardjs-skills/onboardjs-react"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-r inline-flex items-center gap-2 rounded-lg from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-sky-400 hover:to-indigo-400 hover:shadow-lg hover:shadow-sky-500/25"
          >
            Install Skill
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
