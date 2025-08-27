---
title: Event System
nextjs:
  metadata:
    title: Event System
    description: The Event System in OnboardJS allows you to react to key moments in the onboarding flow—such as step changes, flow completion, context updates, and errors. This enables you to integrate analytics, trigger side effects, or customize the onboarding experience in real time.
---

The **Event System** in OnboardJS allows you to react to key moments in the onboarding flow—such as step changes, flow completion, context updates, and errors. This enables you to integrate analytics, trigger side effects, or customize the onboarding experience in real time.

---

## Overview

OnboardJS emits events during the onboarding lifecycle. You can subscribe to these events using the core engine’s API or by providing handler functions in your configuration. Events are essential for:

- Logging and analytics
- Custom UI updates
- Integrating with external systems
- Handling errors and interruptions

---

## Available Events

The following events are emitted by the OnboardingEngine:

| Event Name         | Description                                                      |
|--------------------|------------------------------------------------------------------|
| `stateChange`      | Emitted whenever the engine state changes                        |
| `beforeStepChange` | Fired before a step transition; can be cancelled or redirected   |
| `stepChange`       | Fired after a step transition                                   |
| `flowComplete`     | Emitted when the onboarding flow is completed                    |
| `stepActive`       | Emitted when a step becomes active                              |
| `stepComplete`     | Emitted when a step is completed                                |
| `contextUpdate`    | Emitted when the context is updated                             |
| `error`            | Emitted when an error occurs                                    |

---

## Subscribing to Events

You can subscribe to events using the `addEventListener` method on the engine:

```tsx
const unsubscribe = engine.addEventListener('stepChange', (event) => {
  console.log('Step changed:', event.newStep.id);
});

// To unsubscribe:
unsubscribe();
```

**TypeScript Signature:**

```tsx
addEventListener(
  event: EngineEventType,
  listener: (event: EngineEventPayload) => void
): UnsubscribeFunction;
```

---

## Event Payloads

Each event provides a payload object with relevant data. Here are some key event payloads:

### `beforeStepChange`

```tsx
interface BeforeStepChangeEvent<TContext> {
  currentStep: OnboardingStep<TContext> | null;
  targetStepId: string | number;
  direction: 'next' | 'previous' | 'goto' | 'skip';
  cancel: () => void;
  redirect: (stepId: string | number) => void;
}
```

- **cancel()**: Prevents the step change.
- **redirect(stepId)**: Redirects to a different step.

### `stepChange`

```tsx
interface StepChangeEvent<TContext> {
  newStep: OnboardingStep<TContext> | null;
  oldStep: OnboardingStep<TContext> | null;
  context: TContext;
}
```

### `flowComplete`

```tsx
interface FlowCompleteEvent<TContext> {
  context: TContext;
}
```

### `contextUpdate`

```tsx
interface ContextUpdateEvent<TContext> {
  context: TContext;
  previousContext: TContext;
}
```

### `error`

```tsx
interface ErrorEvent {
  error: Error;
  context: any;
}
```

---

## Event Handlers in Configuration

You can also provide event handlers directly in your engine configuration:

```tsx
const config: OnboardingEngineConfig<MyContext> = {
  steps: [...],
  onStepChange: (newStep, oldStep, context) => {
    // Custom logic on step change
  },
  onFlowComplete: (context) => {
    // Handle flow completion
  },
  // ...other handlers
};
```

**Supported config handlers:**

- `onStepChange(newStep, oldStep, context)`
- `onFlowComplete(context)`
- `onStepActive(context)`
- `onStepComplete(stepData, context)`

These are called at the same time as the corresponding events.

---

## Practical Examples

### Logging Step Changes

```tsx
engine.addEventListener('stepChange', (event) => {
  analytics.track('Onboarding Step Changed', {
    stepId: event.newStep?.id,
    userId: event.context.currentUser?.id,
  });
});
```

### Preventing Navigation

```tsx
engine.addEventListener('beforeStepChange', (event) => {
  if (event.targetStepId === 'dangerous-step') {
    event.cancel();
    alert('You cannot access this step yet.');
  }
});
```

### Redirecting Navigation

```tsx
engine.addEventListener('beforeStepChange', (event) => {
  if (event.targetStepId === 'old-step') {
    event.redirect('new-step');
  }
});
```

### Handling Errors

```tsx
engine.addEventListener('error', (event) => {
  console.error('Onboarding error:', event.error);
  // Optionally show a user-friendly message
});
```

---

## Best Practices

- **Unsubscribe** from events when no longer needed to avoid memory leaks.
- **Use async handlers** if you need to perform asynchronous work (e.g., API calls).
- **Avoid heavy logic** in event handlers to keep onboarding responsive.
- **Leverage config handlers** for common use cases; use `addEventListener` for advanced scenarios.

---

## Summary

- The event system lets you react to onboarding lifecycle events.
- Subscribe using `addEventListener` or provide handlers in your config.
- Use events for analytics, custom logic, error handling, and more.

For more, see [Persistence](./persistence).
