'use client'

import { Link } from '@/components/link'
import { MobileNavigation } from '@/components/mobile-navigation'
import { Search } from '@/components/search'
import { ThemeSelector } from '@/components/theme-selector'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { GitHubStars } from './github-stars'
import { DiscordIcon, OnboardJSIcon } from './icons'
import GithubIcon from './icons/github-icon'

export function Header() {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-none flex-wrap items-center justify-between px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:shadow-none',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 [@supports(backdrop-filter:blur(0))]:bg-white/75 dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'bg-transparent',
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex grow basis-0 items-center">
        <Link
          href="/"
          aria-label="Home page"
          className="flex items-center gap-x-4"
        >
          <OnboardJSIcon className="h-9 w-9 lg:hidden" />
          <OnboardJSIcon className="hidden h-9 w-auto fill-slate-700 lg:block dark:fill-sky-100" />
          <span className="text-2xl font-semibold text-slate-700 dark:text-sky-100">
            OnboardJS
          </span>
        </Link>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative mt-2 flex basis-0 justify-end gap-6 sm:gap-8 md:grow">
        <ThemeSelector className="relative z-10" />
        <Link
          href="https://github.com/Somafet/onboardjs"
          className="group"
          aria-label="GitHub"
        >
          <span className="flex items-center gap-x-2">
            <GithubIcon className="size-6 dark:fill-white" />
            <GitHubStars />
            <span className="lg:hidden">Github</span>
          </span>
        </Link>
        <Link
          target="_blank"
          href="https://discord.onboardjs.com"
          className="group"
          aria-label="Discord"
        >
          <DiscordIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
        </Link>
      </div>
    </header>
  )
}
