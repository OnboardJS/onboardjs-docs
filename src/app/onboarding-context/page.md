---
title: Onboarding Context
nextjs:
  metadata:
    title: Onboarding Context
    description: Learn how to use the Onboarding Context in OnboardJS to manage user data and flow state.
---

The **Onboarding Context** is the dynamic state object that OnboardJS uses to track everything about a user's progress through your onboarding flow. It is passed to step conditions, navigation functions, and lifecycle hooks, and is available throughout your UI via the React SDK.

---

## What is the Onboarding Context?

The onboarding context is a TypeScript object that persists throughout the lifecycle of an onboarding flow. It is:

- **Mutable**: Steps and your application can update it as the user progresses.
- **Extensible**: You define its shape to fit your product's needs.
- **Flow-aware**: It always contains a special flowData property, which tracks internal onboarding state.

The context is passed to step conditions, event handlers, and is available in your UI via the React SDK.

## Using flowData

`flowData` is your main scratchpad for storing:

- Answers to questions (e.g., user role, preferences)
- Progress flags (e.g., hasCompletedProfile)
- Data for conditional logic (e.g., which steps to show next)
- Any other onboarding-related state

**Example:**

```tsx
// After a SINGLE_CHOICE step:
context.flowData.userRole = 'developer'

// After a checklist step:
context.flowData.completedTasks = ['profile', 'settings']

// For conditional navigation:
if (context.flowData.userRole === 'admin') {
  // Show admin-specific steps
}
```

## Extending the Context

You can add your own properties to the context for your app’s needs. For example:

```tsx
interface MyAppOnboardingContext extends OnboardingContext {
  version: string // Onboarding version
  flowData: {
    userRole?: string // e.g., "developer", "designer"
    hasCompletedProfile?: boolean
    newsletterOptIn?: boolean
    completedTasks?: string[] // e.g., ["profile", "settings"]
    [key: string]: any // Allow additional custom properties
  }
  user?: { id: string; name: string }
  appSettings?: { theme: string }
}
```

Then, use this type in your onboarding config and steps for better type safety.

## How is the Context Updated?

You can update the context at any time using the engine's API.

```typescript
await engine.updateContext({ flowData: { preferences: { theme: 'light' } } })
```

**Updating the flow data** is additive, meaning you can specify only the new data you want to merge into the existing context and the previous values will be preserved.

```typescript
await engine.updateContext({ flowData: { answers: { q1: 'foo' } } })
await engine.updateContext({ flowData: { answers: { q2: 'bar' } } }) // This WILL NOT overwrite q1

await engine.updateContext({ flowData: { preferences: { theme: 'light' } } })
await engine.updateContext({ flowData: { preferences: { theme: 'dark' } } }) // This WILL overwrite the previous value of `theme`
```

Or in React:

```tsx
const { updateContext } = useOnboarding()
updateContext({ flowData: { answers: { q1: 'yes' } } })
```

---

## Accessing the Context

From the Engine:

```tsx
const state = engine.getState()
console.log(state.context.currentUser)
```

From React:

```tsx
const { state } = useOnboarding()
<div>Welcome, {state.context.currentUser.name}!</div>
```

## Using Context in Step Logic

You can use the context in:

- `condition` functions to show/hide steps
- `nextStep`/`previousStep` functions for dynamic navigation
- `onStepActive` and `onStepComplete` hooks for side effects

**Example:**

```tsx
{
  id: 'choose-theme',
  type: 'SINGLE_CHOICE',
  payload: { ... },
  condition: (context) => context.currentUser != null,
  nextStep: (context) =>
    context.preferences.theme === 'dark' ? 'dark-intro' : 'light-intro',
}
```

---

## Best Practices

- **Avoid mutating `flowData` directly**: Let the engine manage it.
- **Keep context serializable**: Avoid non-serializable values (functions, class instances) for persistence compatibility.
- **Type your context**: For safety and IDE support, always define a custom context interface.

---

## Internal Data

OnboardJS manages some internal state in `flowData._internal` (like completed steps and timestamps). You usually don’t need to touch this.

## Summary

- The onboarding context is your single source of truth for onboarding state and optionally user data.
- It is extensible, serializable, and always includes `flowData`.
- You can extend the context with your own properties.
- Use it to drive dynamic flows, persist progress, and personalize onboarding.

---

**Next:**
- [Learn about Navigation & Flow Control](/navigation-and-flow)
