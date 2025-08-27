---
title: useOnboarding Hook
nextjs:
  metadata:
    title: useOnboarding Hook
    description: How to use the `useOnboarding` hook to manage onboarding state and actions in React.
---

The `useOnboarding` hook is the primary way to interact with the onboarding engine from your React components. It provides access to the current onboarding state, navigation actions, and utility functions for rendering step content and managing onboarding UI.

---

## Usage

Call `useOnboarding()` inside any component wrapped by `OnboardingProvider`:

```tsx
import { useOnboarding } from '@onboardjs/react'

/**
 * For wrapping your onboarding experience in a layout.
 */
export function OnboardingUI() {
  const { state, next, previous, skip, goToStep, updateContext, renderStep } =
    useOnboarding()

  if (state.isCompleted) return <div>Onboarding complete!</div>

  return (
    <div>
      <div>{renderStep()}</div>
      <button onClick={() => previous()} disabled={!state.canGoPrevious}>
        Back
      </button>
      <button onClick={() => next()} disabled={!state.canGoNext}>
        Next
      </button>
      {state.isSkippable && <button onClick={() => skip()}>Skip</button>}
    </div>
  )
}
```

---

## Example: Rendering Step Content

Check out the [Defining steps](/steps/defining-steps) page for how to create custom step components and use the component registry.

```tsx
const componentRegistry = {
  INFORMATION: MyInfoComponent, // Maps to step type
  SINGLE_CHOICE: MyChoiceComponent,
  welcome: WelcomeComponent, // Maps to step ID
  // ...other mappings
}

...

<OnboardingProvider componentRegistry={componentRegistry}>
  <OnboardingUI />
</OnboardingProvider>

...

function OnboardingUI() {
  const { renderStepContent, state, currentStep, renderStep } = useOnboarding()

  if (state.isCompleted) return <div>All done!</div>

  return <div>{renderStep()}</div>
}
```

---

## Example: Updating the Context

```tsx
function MyOnboarding() {
  const { state, next, previous, skip, updateContext, renderStep } =
    useOnboarding()

  const handleChoice = (choice: string) => {
    updateContext({
      flowData: {
        answers: { step1: choice },
      },
    })
  }

  return (
    <div>
      <h2>{state.currentStep?.payload.question}</h2>
      <div>{renderStep()}</div>
      <button onClick={() => handleChoice('A')}>A</button>
      <button onClick={() => handleChoice('B')}>B</button>
      <button onClick={() => previous()} disabled={!state.canGoPrevious}>
        Back
      </button>
      {state.isSkippable && <button onClick={() => skip()}>Skip</button>}
    </div>
  )
}
```

---

## Notes

- The hook must be used within a component tree wrapped by `OnboardingProvider`.
- All navigation actions (`next`, `previous`, `skip`, `goToStep`) are async and return promises.
- `updateContext` merges new data into the existing context; it does not replace it.
- Use `setComponentLoading` to show loading states in custom step components (e.g., during async validation).
- The `renderStep` function uses the `componentRegistry` to render the current step's content based on its type or ID.
- If you need to access the onboarding engine instance directly, use the `engine` property.

---

## Summary

- `useOnboarding` gives you full access to onboarding state and actions in React.
- Use it to drive navigation, update context, and render step content.
- Integrates seamlessly with custom UIs and your component registry.

For more, see [Rendering Step Content](/react/render-step-content) and [Examples & Recipes](/react/examples).

---

## Return Value

The hook returns an object with the following properties and actions:

| Property/Action       | Type / Signature                                                           | Description                                                                        |
| --------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `engine`              | `OnboardingEngine<TContext>`                                               | The underlying onboarding engine instance.                                         |
| `state`               | `EngineState<TContext>`                                                    | The current onboarding state (step, context, navigation flags, etc).               |
| `renderStep`          | `() => React.ReactNode`                                                    | Function to render the current step's content based on the **component registry**. |
| `isLoading`           | `boolean`                                                                  | `true` if the engine is loading or hydrating.                                      |
| `currentStep`         | `OnboardingStep<TContext> \| null \| undefined`                            | The current step object, `undefined` if not stated or `null` if finished.          |
| `isCompleted`         | `boolean`                                                                  | `true` if the onboarding flow is complete.                                         |
| `next`                | `(data?: any) => Promise<void>`                                            | Advance to the next step. Optionally merge data into context.                      |
| `previous`            | `() => Promise<void>`                                                      | Go to the previous step.                                                           |
| `skip`                | `() => Promise<void>`                                                      | Skip the current step (if skippable).                                              |
| `goToStep`            | `(id: string \| number, data?: any) => Promise<void>`                      | Jump to a specific step by ID. Optionally merge data into context.                 |
| `updateContext`       | `(newContext: Partial<TContext>) => Promise<void>`                         | Merge new data into the onboarding context.                                        |
| `reset`               | `(newConfig?: Partial<OnboardingEngineConfig<TContext>>) => Promise<void>` | Reset the onboarding flow. Optionally provide new config.                          |
| `setComponentLoading` | `(isLoading: boolean) => void`                                             | Set a loading state for custom step components.                                    |
