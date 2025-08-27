---
title: Onboarding Config
nextjs:
  metadata:
    title: Onboarding Config
    description: How to configure your onboarding steps and options in OnboardJS.
---

The heart of any OnboardingJS flow is its configuration. This is where you define the structure, content, and logic of your user onboarding experience. The primary configuration object is passed to the `OnboardingEngine` (directly or via the `OnboardingProvider` in React).

---

## Main Configuration Object `OnboardingEngineConfig`

The `OnboardingEngineConfig` is an object that brings together all aspects of your onboarding flow. Here are its key properties:

```tsx
// Example: onboarding-config.ts
import { OnboardingEngineConfig, OnboardingStep } from "@onboardjs/core";

export const myAppOnboardingConfig: OnboardingEngineConfig = {
  // 1. Define your steps (see below)
  steps: [ /* ... your step objects ... */ ],

  // 2. (Optional) Tell it where to start
  initialStepId: "welcome", // The 'id' of your first step

  // 3. (Optional) Actions when things happen
  onFlowComplete: (context) => {
    console.log("All done!", context.flowData);
    // Example: Mark onboarding as done for the user
  },
  onStepChange: (newStep, oldStep) => {
    console.log(`Moved from ${oldStep?.id} to ${newStep?.id}`);
  },

  // 4. (Optional) Initial data for your flow
  // initialContext: {
  //   flowData: { userSegment: 'trial' }
  // }
};
```

## Defining a Step `OnboardingStep`

Each step in the `steps` array is an object with a few important properties:

```tsx
// Example of a single step object
const welcomeStep: OnboardingStep = {
  id: "welcome", // Unique ID for this step
  type: "INFORMATION", // What kind of step is this? (e.g., "INFORMATION", "SINGLE_CHOICE", "CUSTOM_COMPONENT")
  payload: {       
    // Data for this step
    title: "Welcome to Our App!",
    mainText: "We're glad to have you.",
    ctaButtonText: "Next", // Text for the main action button
  },
  nextStep: "feature-overview", // (Optional) ID of the step to go to next
  // previousStep: "some-other-step-id", // Optional: ID of the previous step
  // condition: (context) => context.flowData.userIsAdmin === true, // Optional: Only show if condition is met
};
```

## The context and flowData

Throughout your onboarding, OnboardJS maintains a `context` object. A special part of this is `context.flowData`.

- `context.flowData`: This is your scratchpad!
  - Store answers from questions (e.g., context.flowData.userRole = 'developer').
  - Track progress or choices.
  - Use it in condition functions to show/hide steps.
  - Use it in nextStep functions for dynamic routing.

## Putting It Together (Minimal Example)

```tsx
// onboarding-config.ts
import { OnboardingEngineConfig, OnboardingStep } from "@onboardjs/core";

const steps: OnboardingStep[] = [
  {
    id: "step1",
    type: "INFORMATION",
    payload: { title: "Step 1: Welcome", mainText: "Hello there!" },
    nextStep: "step2",
  },
  {
    id: "step2",
    type: "INFORMATION",
    payload: { title: "Step 2: You're Done!", mainText: "That was easy." },
    nextStep: null, // End of flow
    previousStep: "step1",
  },
];

export const minimalOnboardingConfig: OnboardingEngineConfig = {
  steps: steps,
  initialStepId: "step1",
  onFlowComplete: () => {
    alert("Onboarding finished!");
  },
};
```

This configuration defines the "what" and "when" of your onboarding. The "how it looks" is up to your React components that will use this configuration via `@onboardjs/react`.

## Next Steps

- Learn how to use this configuration with the [`OnboardingProvider`](/react/onboarding-provider) in your React app.
- See how to access and control the flow using the [`useOnboarding` hook](/react/use-onboarding-hook).
