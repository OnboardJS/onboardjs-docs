'use client'

import ComponentPreview from '@/components/component-preview/component-preview'
import { Deps } from '@/components/component-preview/deps'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart3Icon, CodeIcon, MegaphoneIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'

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

export default function PersonaSelectPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Persona Select Example
        </h2>
        <p className="text-muted-foreground">
          This is an example of how you can easily create more personalized
          onboarding experiences by allowing users to select their role or
          persona. This helps tailor the onboarding flow to their specific needs
          and use cases.
        </p>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm font-semibold">
          Dependencies
        </p>
        <Deps dependencies={['card', 'label', 'input']} />
      </div>

      <ComponentPreview
        component={
          <>
            <div className="mb-8 grid grid-cols-1 gap-4">
              {personaOptions.map((option, idx) => {
                const IconComponent = option.icon
                const isSelected = selectedRole === option.id

                return (
                  <Card
                    as="button"
                    key={option.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                      isSelected
                        ? 'ring-primary bg-primary/5 border-primary/50 ring-2'
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedRole(option.id)}
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
              {selectedRole === 'other' && (
                <Card className="border-primary/20 mb-8">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="customRole"
                        className="text-base font-medium"
                      >
                        Tell us about your role
                      </Label>
                      <Input
                        id="customRole"
                        placeholder="e.g., UX Designer, Startup Founder, Content Creator..."
                        className="text-base"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        }
        code={`const { updateContext, state } = useOnboarding()

// Check against the stored context to see if a role is selected
const isSelectedRole = (role: string) => state?.context.flowData.persona === role

const handlePersonaSelect = (role: string) => {
  // Update the onboarding context with the selected role
  updateContext({
    flowData: {
      persona: role,
    },
  })
}

return (<div className="mb-8 grid grid-cols-1 gap-4">
  {personaOptions.map((option, idx) => {
    const IconComponent = option.icon
    const isSelected = isSelectedRole(option.id)

    return (
      <Card
        role="button"
        key={option.id}
        className={\`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg \${
          isSelected
            ? 'ring-primary bg-primary/5 border-primary/50 ring-2'
            : 'hover:border-primary/30'
        }\`}
        onClick={() => handlePersonaSelect(option.id)}
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
  {selectedRole === 'other' && (
    <Card className="border-primary/20 mb-8">
      <CardContent className="p-6">
        <div className="space-y-3">
          <Label
            htmlFor="customRole"
            className="text-base font-medium"
          >
            Tell us about your role
          </Label>
          <Input
            id="customRole"
            placeholder="e.g., UX Designer, Startup Founder, Content Creator..."
            className="text-base"
          />
        </div>
      </CardContent>
    </Card>
  )}
</div>)`}
        extras={[
          {
            name: 'Modified Card',
            code: `/**
 * Modified Card component with "as" prop so it can be used as a button
 * in the persona select example.
 */
import * as React from "react"

import { cn } from "@/utils/utils"

type CardProps<T extends React.ElementType = "div"> = {
  as?: T
  className?: string
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">

function Card<T extends React.ElementType = "div">({ 
  as, 
  className, 
  ...props 
}: CardProps<T>) {
  const Component = as || "div"
  
  return (
    <Component
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}`,
          },
        ]}
      />
    </div>
  )
}
