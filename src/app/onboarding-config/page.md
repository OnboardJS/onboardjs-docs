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
  // 1. Define your steps (see next page)
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

## The context and flowData

Throughout your onboarding, OnboardJS maintains a `context` object. A special part of this is `context.flowData`.

- `context.flowData`: This is your scratchpad!
  - Store answers from questions (e.g., context.flowData.userRole = 'developer').
  - Track progress or choices.
  - Use it in condition functions to show/hide steps.
  - Use it in nextStep functions for dynamic routing.
