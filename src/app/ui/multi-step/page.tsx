'use client'

import ComponentPreview from '@/components/component-preview/component-preview'
import { Deps } from '@/components/component-preview/deps'
import MultiStepOnboarding from '@/components/examples/multi-step/multi-step-onboarding'
import {
  OnboardingProvider,
  type StepComponentRegistry,
} from '@onboardjs/react'
import dynamic from 'next/dynamic'

const FirstStep = dynamic(
  () => import('@/components/examples/multi-step/first-step'),
)

const SecondStep = dynamic(
  () => import('@/components/examples/multi-step/second-step'),
)

const steps = [
  {
    id: 'step1',
  },
  {
    id: 'step2',
    nextStepId: null,
  },
]

const registry: StepComponentRegistry = {
  step1: FirstStep,
  step2: SecondStep,
}

export default function MultiStepPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Multi-Step Onboarding Example
        </h2>
        <p className="text-muted-foreground">
          This is a full code example of a multi-step onboarding flow using
          OnboardJS. It includes two steps:
        </p>
        <ul className="my-4 list-disc pl-5">
          <li>
            <strong>First Step:</strong> A welcome screen with a button to start
            the onboarding experience.
          </li>
          <li>
            <strong>Second Step:</strong> A persona selection step where users
            can choose their role and provide additional information.
          </li>
        </ul>
        <p>
          The example demonstrates how to use the <code>useOnboarding</code>{' '}
          hook to manage the onboarding state and navigate between steps.
        </p>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm font-semibold">
          Dependencies
        </p>
        <Deps dependencies={['card', 'label', 'input', 'button']} />
      </div>

      <ComponentPreview
        component={
          <OnboardingProvider steps={steps} componentRegistry={registry}>
            <MultiStepOnboarding />
          </OnboardingProvider>
        }
        code={``}
        extras={[
          {
            name: 'config.tsx',
            code: `const FirstStep = dynamic(
  () => import('@/components/onboarding/first-step'),
)

const SecondStep = dynamic(
  () => import('@/components/onboarding/second-step'),
)

export const steps = [
  {
    id: 'step1',
  },
  {
    id: 'step2',
    nextStepId: null
  },
]

export const registry = {
  step1: FirstStep,
  step2: SecondStep
}`,
          },
          {
            name: 'page.tsx',
            code: `import { OnboardingProvider } from '@onboardjs/react'
import { steps, registry } from './config'
import OnboardingUI from '@/components/onboarding/onboarding-ui'

export default function MultiStepPage() {
  return (
    <OnboardingProvider steps={steps} componentRegistry={registry}>
      <OnboardingUI />
    </OnboardingProvider>
  )
}`,
          },
          {
            name: 'onboarding-ui.tsx',
            code: `'use client'
            
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOnboarding } from '@onboardjs/react'

export default function OnboardingUI() {
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
}`,
          },
          {
            name: 'first-step.tsx',
            code: `'use client'

import { Button } from '@/components/ui/button'
import { useOnboarding } from '@onboardjs/react'
import { ArrowRight, SparklesIcon } from 'lucide-react'
import { Link } from '@/components/link'

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
`,
          },
          {
            name: 'second-step.tsx',
            code: `'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOnboarding } from '@onboardjs/react'
import {
  ArrowRightIcon,
  BarChart3Icon,
  CodeIcon,
  MegaphoneIcon,
  UserIcon,
  WandSparklesIcon,
} from 'lucide-react'

const personaOptions = [
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Enhance product showcases & stakeholder presentations',
    icon: BarChart3Icon,
  },
  {
    id: 'marketing-professional',
    title: 'Marketing Professional',
    description: 'Create engaging ad creatives & campaigns',
    icon: MegaphoneIcon,
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer / Developer',
    description: 'Integrate stunning 3D into your apps',
    icon: CodeIcon,
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Tell us about your specific use case',
    icon: UserIcon,
  },
]

export default function PersonaStep() {
  const { next, previous, updateContext, state } = useOnboarding()

  const selectedRole = state?.context.flowData?.selectedRole || ''

  const handleRoleChange = (selectedRole: string) => {
    updateContext({ flowData: { selectedRole } })
  }

  const handleCustomRoleChange = (customRole: string) => {
    updateContext({ flowData: { customRole } })
  }

  return (
    <>
      <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <WandSparklesIcon className="text-primary animate-in fade-in zoom-in h-10 w-10 duration-300" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold">Tell us about yourself</h1>
        <p className="text-muted-foreground text-lg">
          Help us tailor your KoolSaaS experience to your specific needs
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4">
        {personaOptions.map((option, idx) => {
          const IconComponent = option.icon
          const isSelected = selectedRole === option.id

          return (
            <Card
              key={option.id}
              className={\`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg \${isSelected
                ? 'ring-primary bg-primary/5 border-primary/50 ring-2'
                : 'hover:border-primary/30'
              }\`}
              onClick={() => handleRoleChange(option.id)}
            >
              <CardContent className="text-left">
                <div className="items-start max-sm:space-y-4 sm:flex sm:space-x-4">
                  <div
                    className={\`rounded-lg p-3 max-sm:w-fit \${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}\`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold">{option.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedRole === 'other' && (
        <Card className="border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Label htmlFor="customRole" className="text-base font-medium">
                Tell us about your role
              </Label>
              <Input
                id="customRole"
                placeholder="e.g., UX Designer, Startup Founder, Content Creator..."
                defaultValue={state?.context.flowData?.customRole}
                onChange={(e) => handleCustomRoleChange(e.target.value)}
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-x-4">
        <Button
          onClick={() => previous()}
          size="lg"
          variant={'outline'}
          className="sm:min-w-[200px]"
        >
          Back
        </Button>
        <Button
          onClick={() => next()}
          disabled={!selectedRole}
          size="lg"
          className="sm:min-w-[200px]"
        >
          Next
          <ArrowRightIcon className="ml-2 size-4" />
        </Button>
      </div>
    </>
  )
}
`,
          },
        ]}
      />
    </div>
  )
}
