---
title: Rendering Step Component
nextjs:
  metadata:
    title: Rendering Step Component
    description: How to render onboarding steps using custom React components in OnboardJS.
---

OnboardJS is headless by design, meaning you have full control over how each onboarding step is rendered. The React SDK makes it easy to map steps to custom components, allowing you to create a tailored user experience.

---

## How Step Rendering Works

You can render each step in your onboarding flow in two main ways:

- Each step in your onboarding flow can be associated with a custom React component.
- You can define a component registry that maps step IDs or step types to specific components.

---

## 1. Component in Step Config

You can specify the component to render for each step right in your step definition:

```tsx
// import the type from the React SDK instead of the core SDK
import type { OnboardingStep } from '@onboardjs/react'
import InitialStep from './steps/initial-step'

const initialStep: OnboardingStep = {
  id: 'initial',
  // Using the React specific OnboardingStep type to define the step component right in the step definition
  component: InitialStep,

  meta: {
    title: 'Unlock your tailored OnboardJS experience!',
    subtitle: 'Which best describes your goal?',
  },
}
```

This allows you to directly associate a React component with each step, making it easy to manage your onboarding flow.

---

## 2. Using a Component Registry

You can also create a component registry that maps step IDs to components. This is useful for larger applications where you want to keep your step definitions clean and separate from the rendering logic or when you want to assign a component based on the step type.

```tsx
import { OnboardingStep } from '@onboardjs/core'
import InformationStep from './steps/information-step'

const componentRegistry = {
  // Specify the component based on the step type
  INFORMATION: InformationStep,
}

const steps: OnboardingStep[] = [
  {
    id: 'initial',
    type: 'INFORMATION',
    component: 'initial', // Reference by ID
    meta: {
      title: 'Unlock your tailored OnboardJS experience!',
      subtitle: 'Which best describes your goal?',
    },
  },
  {
    id: 'another',
    type: 'INFORMATION',
    component: 'another', // Reference by ID
    meta: {
      title: 'Another Step',
      subtitle: 'This is another step in the onboarding process.',
    },
  },
]
```

## Step Component Props

Each step component receives the following props:

```tsx
import type { StepComponentProps } from '@onboardjs/react'

interface StepComponentProps<TPayload = any, TContext = any> {
  payload: TPayload
  /**
   * The full context of the current onboarding session.
   * This includes any data collected so far, such as answers to previous steps.
   */
  context: TContext
}
```

This gives your components full access to the current step's payload and the overall context of the onboarding session, allowing you to build dynamic and responsive UIs.

---

## Example: Custom Step Component

```tsx
type YourPayload = {
  title: string
}

function MyCustomComponent({
  payload,
  context,
}: StepComponentProps<YourPayload>) {
  const { updateContext, next } = useOnboarding()

  const handleSubmit = async () => {
    updateContext({ flowData: { answers: { custom: true } } })
  }

  return (
    <div>
      <h2>{payload.title}</h2>
      <button onClick={handleSubmit}>Send</button>
    </div>
  )
}
```

---

## Rendering the Current Step

You can use the `renderStep` function from the `useOnboarding` hook to automatically render the current step's component based on the step ID or type defined in your onboarding configuration.

```tsx
export default function OnboardingUI() {
  const { state, currentStep, renderStep } = useOnboarding()

  if (!state) {
    return <Loading />
  }

  if (!currentStep) {
    return (
      <div className="p-10 text-center text-gray-500">
        No active onboarding step.
      </div>
    )
  }

  return <>{renderStep()}</>
}
```

---

## Fallbacks and Error Handling

- You can customize an OnboardingUI component to handle errors gracefully, such as logging or showing a user-friendly message.

---

## Summary

- `renderStep()` automatically renders the correct component for the current step.
- Step components receive full context and payloads as props.
- Customize your onboarding UI freely—OnboardJS handles the logic, you handle the presentation.

For more, see [useOnboarding Hook](/react/use-onboarding-hook) and [Examples & Recipes](/react/examples).
