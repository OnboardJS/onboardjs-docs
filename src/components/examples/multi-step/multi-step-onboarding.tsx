'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOnboarding } from '@onboardjs/react'

export default function MultiStepOnboarding() {
  const { renderStep, reset, state } = useOnboarding()

  if (!state) {
    return <>Initializing...</>
  }

  return (
    <Card className="bg-card/50 mx-auto w-full max-w-lg border-0 shadow-2xl backdrop-blur-sm">
      <CardContent className="space-y-6 p-8 text-center">
        {state.isCompleted ? (
          <>
            <p>Fin. 🎉</p>
            <p className="text-muted-foreground">
              Your onboarding is complete! You can now start using the app.
            </p>
            <Button
              onClick={() => reset()}
            >
              Reset Example
            </Button>
          </>
        ) : (
          renderStep()
        )}
      </CardContent>
    </Card>
  )
}
