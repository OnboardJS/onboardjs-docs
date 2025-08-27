'use client'

import ComponentPreview from '@/components/component-preview/component-preview'
import { Deps } from '@/components/component-preview/deps'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export default function ProgressExample() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Progress Example
        </h2>
        <p className="text-muted-foreground">
          This example demonstrates how to use the <code>Progress</code>{' '}
          component to display the current progress of the onboarding process.
          The progress is updated based on the state of the onboarding flow.
        </p>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm font-semibold">
          Dependencies
        </p>
        <Deps dependencies={['progress']} />
      </div>

      <ComponentPreview
        component={<Progress value={progress} />}
        code={`import Progress from '@/components/ui/progress'

export default function ProgressExample() {
  const [percentage, setPercentage] = useState(0)
  const { state } = useOnboarding()

  useEffect(() => {
    if (!state) return

    if (state.progressPercentage !== percentage) {
      const timer = setTimeout(
        () => setPercentage(state.progressPercentage ?? 0),
        500,
      )
      return () => clearTimeout(timer)
    }
  }, [state, percentage, setPercentage])
  
  return (
    <Progress
      value={percentage}
    />
  )
}
`}
      />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">With step number</h3>
          <p className="text-muted-foreground">
            You can also display the current step number alongside the progress
            bar.
          </p>
        </div>
        <ComponentPreview
          component={
            <div className="w-full">
              <Progress value={progress} className="mb-4" />
              <p className="text-muted-foreground">
                Step {3} of {4}
              </p>
            </div>
          }
          code={`const [percentage, setPercentage] = useState(0)
const { state } = useOnboarding()

useEffect(() => {
  if (!state) return

  if (state.progressPercentage !== percentage) {
    const timer = setTimeout(
      () => setPercentage(state.progressPercentage ?? 0),
      500,
    )
    return () => clearTimeout(timer)
  }
}, [state, percentage, setPercentage])

return (
  <>
    <Progress value={percentage} className="mb-4" />
    <p className="text-muted-foreground">
      Step {state?.currentStepNumber} of {state?.totalSteps}
    </p>
  </>
)
`}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">With segments</h3>
          <p className="text-muted-foreground">
            You can modify the Shadcn Progress component to support segmented
            progress bars, which can be useful for displaying multiple steps or
            stages in a process.
          </p>
        </div>
        <ComponentPreview
          component={
            <div className="w-full">
              <Progress value={75} className="mb-4" segmented segments={4} />
              <p className="text-muted-foreground">
                Step {4} of {4}
              </p>
            </div>
          }
          code={`const [percentage, setPercentage] = useState(0)
const { state } = useOnboarding()

useEffect(() => {
  if (!state) return

  if (state.progressPercentage !== percentage) {
    const timer = setTimeout(
      () => setPercentage(state.progressPercentage ?? 0),
      500,
    )
    return () => clearTimeout(timer)
  }
}, [state, percentage, setPercentage])

return (
  <>
    <Progress
      value={progress}
      className="mb-4"
      segmented
      segments={state?.totalSteps}
    />
    <p className="text-muted-foreground">
      Step {state?.currentStepNumber} of {state?.totalSteps}
    </p>
  </>
)
`}
          extras={[
            {
              name: 'Segmented Progress',
              code: `"use client"
              
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/utils/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number
  segments?: number
  segmented?: boolean
}

function Progress({
  className,
  value,
  segments = 5,
  segmented = false,
  ...props
}: ProgressProps) {
  if (segmented) {
    const filledSegments = Math.floor(((value || 0) / 100) * segments)
    const partialSegment = ((value || 0) / 100) * segments - filledSegments
    
    return (
      <div
        data-slot="progress"
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full gap-1">
          {Array.from({ length: segments }, (_, index) => {
            let segmentValue = 0
            if (index < filledSegments) {
              segmentValue = 100
            } else if (index === filledSegments && partialSegment > 0) {
              segmentValue = partialSegment * 100
            }
            
            return (
              <div
                key={index}
                className={cn(
                  "bg-primary/20 relative flex-1 overflow-hidden rounded-sm",
                )}
              >
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: \`\${segmentValue}%\` }}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }`,
            },
          ]}
        />
      </section>
    </div>
  )
}
