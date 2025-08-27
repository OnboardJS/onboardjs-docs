'use client'

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
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                isSelected
                  ? 'ring-primary bg-primary/5 border-primary/50 ring-2'
                  : 'hover:border-primary/30'
              }`}
              onClick={() => handleRoleChange(option.id)}
            >
              <CardContent className="text-left">
                <div className="items-start max-sm:space-y-4 sm:flex sm:space-x-4">
                  <div
                    className={`rounded-lg p-3 max-sm:w-fit ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
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
