import clsx from 'clsx'
import Image from 'next/image'
import { Highlight } from 'prism-react-renderer'
import { Fragment } from 'react'

import { Button } from '@/components/button'
import { HeroBackground } from '@/components/hero-background'
import blurCyanImage from '@/images/blur-cyan.png'
import blurIndigoImage from '@/images/blur-indigo.png'
import { StarIcon } from 'lucide-react'
import { TrafficLightsIcon } from './icons'

const codeLanguage = 'tsx'
const code = `function WelcomeStep() {
  const { next } = useOnboarding()
  return (
    <div>
      <button onClick={() => next()}>Next</button>
    </div>
  )
}
`

const tabs = [
  { name: 'WelcomeStep.tsx', isActive: true },
  { name: 'stepsConfig.ts', isActive: false },
]

export function Hero() {
  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-900 dark:-mb-32 dark:-mt-19 dark:pb-32 dark:pt-19">
      <div className="py-16 sm:px-2 lg:relative lg:px-0 lg:py-20">
        <div className="lg:max-w-8xl mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          <div className="relative z-10 md:text-center lg:text-left">
            <Image
              className="absolute bottom-full right-full -mb-56 -mr-72 opacity-50 dark:opacity-50"
              src={blurCyanImage}
              alt=""
              width={530}
              height={530}
              unoptimized
              priority
            />
            <div className="relative">
              <p className="font-display bg-linear-to-r inline from-sky-600 via-sky-500 to-sky-600 bg-clip-text text-5xl tracking-tight text-transparent dark:from-sky-700 dark:via-sky-400 dark:to-sky-700">
                Headless Onboarding for React. No Overlays. Full Control.
              </p>
              <p className="mt-3 text-2xl tracking-tight text-slate-600 dark:text-slate-400">
                State management, analytics, and persistence built-in. Skip the
                tour library limitations. Deploy custom flows in minutes.
              </p>
              <div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
                <Button
                  href="https://github.com/Somafet/onboardjs"
                  className="flex items-center justify-center gap-x-2"
                >
                  <StarIcon
                    data-slot="icon"
                    className="size-4 fill-amber-300"
                  />
                  Star us on GitHub
                </Button>
              </div>
            </div>
          </div>
          <div className="relative lg:static xl:pl-10">
            <div className="mask-[linear-gradient(transparent,white,white)] lg:mask-none dark:mask-[linear-gradient(transparent,white,transparent)] lg:dark:mask-[linear-gradient(white,white,transparent)] absolute inset-x-[-50vw] -bottom-48 -top-32 lg:-bottom-32 lg:-top-32 lg:left-[calc(50%+14rem)] lg:right-0">
              <HeroBackground className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]" />
            </div>
            <div className="relative">
              <Image
                className="absolute -right-64 -top-64 opacity-30 dark:opacity-100"
                src={blurCyanImage}
                alt=""
                width={530}
                height={530}
                unoptimized
                priority
              />
              <Image
                className="absolute -bottom-40 -right-44 opacity-30 dark:opacity-100"
                src={blurIndigoImage}
                alt=""
                width={567}
                height={567}
                unoptimized
                priority
              />
              <div className="bg-linear-to-tr absolute inset-0 rounded-2xl from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
              <div className="bg-linear-to-tr absolute inset-0 rounded-2xl from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
              <div className="relative rounded-2xl bg-white/90 ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-[#0A101F]/80 dark:ring-white/10">
                <div className="bg-linear-to-r absolute -top-px left-20 right-11 h-px from-sky-300/0 via-sky-300/70 to-sky-300/0" />
                <div className="bg-linear-to-r absolute -bottom-px left-11 right-20 h-px from-blue-400/0 via-blue-400 to-blue-400/0" />
                <div className="pl-4 pt-4">
                  <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-400/80 dark:stroke-slate-500/30" />
                  <div className="mt-4 flex space-x-2 text-xs">
                    {tabs.map((tab) => (
                      <div
                        key={tab.name}
                        className={clsx(
                          'flex h-6 rounded-full',
                          tab.isActive
                            ? 'bg-linear-to-r from-sky-400/30 via-sky-400 to-sky-400/30 p-px font-medium text-sky-600 dark:text-sky-300'
                            : 'text-slate-500',
                        )}
                      >
                        <div
                          className={clsx(
                            'flex items-center rounded-full px-2.5',
                            tab.isActive && 'bg-white dark:bg-slate-800',
                          )}
                        >
                          {tab.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-start px-1 text-sm">
                    <div
                      aria-hidden="true"
                      className="select-none border-r border-slate-200 pr-4 font-mono text-slate-400 dark:border-slate-300/5 dark:text-slate-600"
                    >
                      {Array.from({
                        length: code.split('\n').length,
                      }).map((_, index) => (
                        <Fragment key={index}>
                          {(index + 1).toString().padStart(2, '0')}
                          <br />
                        </Fragment>
                      ))}
                    </div>
                    <Highlight
                      code={code}
                      language={codeLanguage}
                      theme={{ plain: {}, styles: [] }}
                    >
                      {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                      }) => (
                        <pre
                          className={clsx(
                            className,
                            'flex overflow-x-auto pb-6 text-slate-700 dark:text-slate-200',
                          )}
                          style={style}
                        >
                          <code className="px-4">
                            {tokens.map((line, lineIndex) => (
                              <div key={lineIndex} {...getLineProps({ line })}>
                                {line.map((token, tokenIndex) => (
                                  <span
                                    key={tokenIndex}
                                    {...getTokenProps({ token })}
                                  />
                                ))}
                              </div>
                            ))}
                          </code>
                        </pre>
                      )}
                    </Highlight>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
