---
title: Navigation & Flow
nextjs:
  metadata:
    title: Navigation & Flow
    description: Navigation and flow control are at the heart of creating dynamic, personalized onboarding experiences—whether your flow is linear, branching, or adapts in real time to user input.
---

OnboardJS provides a powerful, flexible system for controlling how users move through your onboarding flow. Navigation and flow control are at the heart of creating dynamic, personalized onboarding experiences—whether your flow is linear, branching, or adapts in real time to user input.

This page covers how navigation works in OnboardJS, how to configure step transitions, and how to programmatically control the flow using the engine and React SDK.

---

## Overview

Navigation in OnboardJS is managed by the **OnboardingEngine**. The engine tracks the current step, determines which steps are available, and exposes methods for moving forward, backward, skipping, or jumping to specific steps. You can control navigation declaratively (via step configuration) and imperatively (via engine methods or React hook actions).

---

## Step Navigation Methods

The engine exposes several methods for controlling navigation:

```tsx
// Core API
engine.next(data?: any): Promise<void>
engine.previous(): Promise<void>
engine.skip(): Promise<void>
engine.goToStep(id: string | number, data?: any): Promise<void>

```

In React, these are available via the `useOnboarding` hook:

```tsx
const { next, previous, skip, goToStep } = useOnboarding()
```

---

## Step Configuration: Controlling Flow

Each step can define navigation logic using these properties:

| Property       | Type                                  | Description                                                                                             |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `nextStep`     | `string \| number \| (context) => id` | ID of the next step, or a function returning the ID                                                     |
| `previousStep` | `string \| number \| (context) => id` | ID of the previous step, or a function returning the ID                                                 |
| `isSkippable`  | `boolean`                             | Whether this step can be skipped. Defaults to `false`.                                                  |
| `skipToStep`   | `string \| number \| (context) => id` | ID of the step to jump to when skipping this step. If not defined, skips to the next step in the array. |
| `condition`    | `(context) => boolean`                | Condition to determine if the step should be shown. If false, the step is skipped.                      |

---

## Conditional Navigation

You can use functions for `nextStep`, `previousStep`, `skipToStep`, and condition to create dynamic, context-aware flows.

**Example: Branching Based on User Input**

```tsx
{
  id: 'profile',
  nextStep: (context) => {
    if (context.flowData.answers.isDeveloper) return 'dev-setup';
    return 'user-setup';
  },
  condition: (context) => context.currentUser != null,
}
```

---

## Programmatic Navigation

You can control navigation from your application code, for example in response to user actions or API results.

**In React:**

```tsx
const { next, goToStep, updateContext } = useOnboarding();

const handleSubmit = async (formData) => {
  await someAPICall();
  await next();
};
```

## Skipping Steps

- Set `isSkippable`: true on a step to allow skipping.
- Optionally, set `skipToStep` to control where skipping leads.
- The `skip()` method will only work if the current step is skippable.

**Example**

```tsx
{
  id: 'optional-survey',
  isSkippable: true,
  skipToStep: 'final-step',
}
```

## Edge Cases & Best Practices

- **First/Last Step**:   
  The engine tracks `isFirstStep` and `isLastStep` in its state.
  Use these to disable navigation buttons or show completion UI.
- **Non-linear Flows**:   
  Use functions for `nextStep` and `previousStep` to create branches, loops, or conditional jumps.
- **Step Conditions**:   
  Steps with a `condition` returning `false` are skipped automatically.
- **User Interruptions**:   
  Persist context and current step to allow resuming flows.
- **Checklist Steps**:   
  For steps of type `CHECKLIST`, use `updateChecklistItem` to mark items complete and control when the user can proceed.

---

## Example: Linear vs. Branching Flow

**Linear Flow:**

```tsx
const steps = [
  { id: 'welcome', nextStep: 'profile' },
  { id: 'profile', nextStep: 'summary' },
  { id: 'summary', nextStep: null },
];
```

**Branching Flow:**

```tsx
const steps = [
  { id: 'welcome', nextStep: 'profile' },
  {
    id: 'profile',
    type: 'SINGLE_CHOICE',
    nextStep: (context) =>
      context.answers.role === 'admin' ? 'admin-setup' : 'user-setup',
  },
  { id: 'admin-setup', nextStep: 'summary' },
  { id: 'user-setup', nextStep: 'summary' },
  { id: 'summary', nextStep: null },
];
```

## Accessing Navigation State

The engine and React hook provide navigation state:

```tsx
// Engine
const state = engine.getState();
console.log(state.isFirstStep, state.isLastStep, state.canGoNext);

// React
const { state } = useOnboarding();
if (state.isLastStep) {
  // Show completion UI
}
```

## Summary

- Navigation is controlled via step configuration and engine methods.
- Use `nextStep`, `previousStep`, `skipToStep`, and `condition` for dynamic flows.
- Use engine methods or React hook actions for programmatic control.
- Always check navigation state to guide UI and user experience.

For more, see [Defining Steps](/steps/defining-steps) and [Event System](/event-system).

## API Reference

### **next(data?)**

Advances to the next step.

- If the current step defines a `nextStep`, it is used.
- If not, the engine advances to the next step in the steps array.
- Optionally, you can pass data to be merged into the context.

### **previous()**

Moves back to the previous step.

- Uses `previousStep` if defined, otherwise moves to the previous step in the array.

### **skip()**

Skips the current step.

- If the current step is skippable (`isSkippable: true` in the step config), it skips to the next step.
- If the current step has a `skipToStep`, it jumps to that step.
- If not, it skips to the next step in the array.

### **goToStep(id, data?)**

Jumps to a specific step by ID.

- If the step exists, it becomes the current step.
- Optionally, you can pass data to be merged into the context.
- If the step is not found, it throws an error.
