"use client"

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
                  style={{ width: `${segmentValue}%` }}
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
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
