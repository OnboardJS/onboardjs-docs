'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LoaderCircleIcon } from 'lucide-react'
import {
  posthog,
  type CaptureOptions,
  type EventName,
  type Properties,
} from 'posthog-js'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/components/link'

const variantStyles = {
  primary:
    'rounded-full bg-sky-300 py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500',
  secondary:
    'rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400',
  outline:
    'rounded-full border border-slate-500 bg-transparent py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300/50 active:bg-slate-200',
  ghost:
    'rounded-full bg-transparent py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-100/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300/50 active:bg-slate-200',
}

type ButtonProps = {
  contentClassName?: string
  variant?: keyof typeof variantStyles
  loading?: boolean
  loadingShowContent?: boolean
  trackEvent?:
    | string
    | {
        event_name: EventName
        properties?: Properties | null
        options?: CaptureOptions
      }
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  contentClassName = undefined,
  loading = false,
  loadingShowContent = false,
  trackEvent,
  onClick,
  children,
  ...props
}: ButtonProps) {
  className = clsx(variantStyles[variant], 'relative isolate', className)
  const [isLoading, setIsLoading] = useState(loading)

  const trackEvents = useCallback(() => {
    if (trackEvent) {
      const eventName =
        typeof trackEvent === 'string' ? trackEvent : trackEvent.event_name
      const properties =
        typeof trackEvent === 'string' ? undefined : trackEvent.properties
      const options =
        typeof trackEvent === 'string' ? undefined : trackEvent.options

      posthog.capture(eventName, { ...properties }, options)
    }
  }, [trackEvent])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  const handleOnClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
      React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    trackEvents()
    if (onClick) {
      setIsLoading(true)
      await onClick(event)
      setIsLoading(false)
    }
  }

  // Take all the hover classes from className
  const hoverClasses = className
    .split(' ')
    .filter((c) => c.startsWith('data-hover:') || c.startsWith('hover:'))

  return typeof props.href === 'undefined' ? (
    <Headless.Button className={className} onClick={handleOnClick} {...props}>
      {isLoading ? (
        <div
          className={clsx(
            loadingShowContent
              ? ''
              : 'absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center',
          )}
        >
          <LoaderCircleIcon className={clsx('h-6 w-6 animate-spin')} />
        </div>
      ) : null}

      <div
        className={clsx(
          'flex h-full w-full items-center justify-center gap-2',
          isLoading && !loadingShowContent ? 'opacity-0' : '',
          contentClassName,
        )}
      >
        <TouchTarget className={clsx(hoverClasses)}>{children}</TouchTarget>
      </div>
    </Headless.Button>
  ) : (
    <Link className={className} trackEvent={trackEvent} {...props}>
      <TouchTarget className={clsx(hoverClasses, 'cursor-pointer')}>
        {children}
      </TouchTarget>
    </Link>
  )
}

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      <span
        className={clsx(
          'absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden',
          className,
        )}
        aria-hidden="true"
      />
      {children}
    </>
  )
}
