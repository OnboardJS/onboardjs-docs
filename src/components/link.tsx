'use client'

import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import {
  posthog,
  type CaptureOptions,
  type EventName,
  type Properties,
} from 'posthog-js'
import { forwardRef, useCallback } from 'react'

export const Link = forwardRef(function Link(
  {
    trackEvent,
    onClick,
    ...props
  }: LinkProps &
    React.ComponentPropsWithoutRef<'a'> & {
      trackEvent?:
        | string
        | {
            event_name: EventName
            properties?: Properties | null
            options?: CaptureOptions
          }
    },
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  const trackEvents: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      if (trackEvent) {
        const eventName =
          typeof trackEvent === 'string' ? trackEvent : trackEvent.event_name
        const properties =
          typeof trackEvent === 'string' ? undefined : trackEvent.properties
        const options =
          typeof trackEvent === 'string' ? undefined : trackEvent.options

        posthog.capture(eventName, properties, options)
      }
      onClick?.(event)
    },
    [onClick, trackEvent],
  )
  return (
    <Headless.DataInteractive>
      <NextLink ref={ref} {...props} onClick={trackEvents} />
    </Headless.DataInteractive>
  )
})
