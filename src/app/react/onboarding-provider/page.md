---
title: OnboardingProvider
nextjs:
  metadata:
    title: OnboardingProvider
    description: Quidem magni aut exercitationem maxime rerum eos.
---

The `OnboardingProvider` component is the entry point for integrating OnboardJS into your React application. It creates and manages the onboarding engine instance, provides onboarding state and actions via React context, and handles persistence and configuration.

---

## Usage

Wrap your app (or any subtree that needs onboarding) with `OnboardingProvider`:

```tsx
import { OnboardingProvider } from '@onboardjs/react'

<OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
  <OnboardingApp />
</OnboardingProvider>
```

---

## Props

| Prop                         | Type                                           | Description                                                                                  |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `steps`                      | `OnboardingStep<TContext>[]`                   | **Required.** Array of onboarding steps.                                                     |
| `componentRegistry`          | `{ [key: string]: React.ComponentType<any> }`  | **Required.** Maps step types and ids to custom React components for rendering step content. |
| `initialStepId`              | `string \| number`                             | Optional. ID of the step to start from.                                                      |
| `initialContext`             | `Partial<TContext>`                            | Optional. Initial onboarding context.                                                        |
| `onFlowComplete`             | `(context: TContext) => void \| Promise<void>` | Optional. Called when the onboarding flow is completed.                                      |
| `onStepChange`               | `(newStep, oldStep, context) => void`          | Optional. Called after a step changes.                                                       |
| `onStepActive`               | `(context: TContext) => void \| Promise<void>` | Optional. Called when a step becomes active.                                                 |
| `onStepComplete`             | `(stepData: any, context: TContext) => void`   | Optional. Called when a step is completed.                                                   |
| `localStoragePersistence`    | `{ key: string; ttl?: number }`                | Optional. Enables localStorage persistence with the given key and optional TTL (ms).         |
| `customOnDataLoad`           | `() => Promise<TContext> \| TContext`          | Optional. Custom function to load persisted context.                                         |
| `customOnDataPersist`        | `(context: TContext) => Promise<void> \| void` | Optional. Custom function to persist context.                                                |
| `customOnClearPersistedData` | `() => Promise<void> \| void`                  | Optional. Custom function to clear persisted data.                                           |
| `children`                   | `React.ReactNode`                              | **Required.** The subtree that will have access to onboarding context.                       |

---

## Example: Basic Usage

```tsx
import { OnboardingProvider } from '@onboardjs/react'

const steps = [
  {
    id: 'welcome',
    type: 'INFORMATION',
    payload: { message: 'Welcome to our app!' },
  },
  {
    id: 'setup',
    type: 'SINGLE_CHOICE',
    payload: { question: 'Choose your setup option' },
  },
  // ...other steps
]

const componentRegistry = {
  INFORMATION: MyInfoComponent,
  SINGLE_CHOICE: MyChoiceComponent,
  // ...other mappings
}

function App() {
  return (
    <OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
      <MainOnboardingUI />
    </OnboardingProvider>
  )
}
```

---

## Example: With Local Storage Persistence

```tsx
<OnboardingProvider
  steps={steps}
  localStoragePersistence={{
    key: 'onboardjs:my-flow',
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (optional)
  }}
>
  <App />
</OnboardingProvider>
```

---

## Example: Custom Persistence (e.g., Supabase)

```tsx
<OnboardingProvider
  steps={steps}
  customOnDataLoad={async () => {
    const { data } = await this.supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    return {
      flowData: data.flow_data || {},
      currentStepId: data.current_step_id,
      // Include any other context fields stored in Supabase
      ...(data.context_data || {}),
    }
  }}
  customOnDataPersist={async (context) => {
    // Update in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding_progress: progress })
      .eq('id', userId)
      .select('onboarding_progress')
      .single()

    if (error) {
      throw new Error(`Failed to update onboarding: ${error.message}`)
    }

    return data.onboarding_progress
  }}
  customOnClearPersistedData={async () => {
    // Clear onboarding data in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_progress: null })
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to clear onboarding data: ${error.message}`)
    }
  }}
>
  <App />
</OnboardingProvider>
```

---

## Example: Custom Step Components

```tsx

const steps = [
  {
    id: 'welcome',
    type: 'INFORMATION',
    payload: { message: 'Welcome to our app!' },
  },
  {
    id: 'setup',
    type: 'SINGLE_CHOICE',
    payload: { question: 'Choose your setup option' },
  },
  // ...other steps
]

const componentRegistry = {
  INFORMATION: MyInfoComponent, // Maps to step type
  SINGLE_CHOICE: MyChoiceComponent, // Maps to step type
  welcome: WelcomeComponent, // Maps to specific step ID
  // ...other mappings
}

<OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
  <OnboardingApp />
</OnboardingProvider>
```

---

## Notes

- The provider **must** wrap any component that uses the `useOnboarding` hook.
- If you provide both `localStoragePersistence` and custom persistence handlers, the custom handlers take precedence.
- You can use the `onFlowComplete`, `onStepChange`, and other event props to trigger side effects or analytics.
- The `componentRegistry` allows you to define custom React components for rendering step content based on step type or ID.

---

## Summary

- `OnboardingProvider` sets up the onboarding engine and context for your React app.
- Supports flexible configuration, persistence, and custom step rendering.
- Required for using the `useOnboarding` hook and accessing onboarding state/actions.

For more, see [useOnboarding Hook](/react/use-onboarding-hook) and [Rendering Step Content](/react/render-step-content).
