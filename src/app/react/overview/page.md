---
title: React - Overview
nextjs:
  metadata:
    title: React - Overview
    description: Learn how to integrate OnboardJS with React applications using the @onboardjs/react package. This guide covers key features, usage patterns, and how to manage onboarding flows in your React projects.
---

The `@onboardjs/react` package provides seamless integration of OnboardJS into React applications. It wraps the headless core engine with idiomatic React APIs, making it easy to manage onboarding flows, state, and UI in your React projects.

---

## What is **@onboardjs/react**?

- **React bindings for OnboardJS:**  
  Provides context, hooks, and components to connect your onboarding logic to your React UI.
- **Powered by the core engine:**  
  All onboarding logic, state, and flow control are handled by the headless `@onboardjs/core` engine.
- **UI-agnostic and flexible:**  
  You control the look and feel of your onboarding experience, while the SDK manages state and navigation.

---

## Key Features

- **OnboardingProvider:**  
  A React context provider that manages the onboarding engine instance and state.
- **useOnboarding Hook:**  
  Access engine actions, onboarding state, and helpers in any component.
- **Persistence:**  
  Built-in support for localStorage or custom persistence strategies.
- **Event Handling:**  
  React-friendly event and lifecycle hooks for onboarding events.

---

## High-Level Usage

1. **Wrap your app (or a section) with `OnboardingProvider`:**

    ```tsx
    import { OnboardingProvider } from '@onboardjs/react';

    <OnboardingProvider steps={steps} localStoragePersistence={{ key: 'onboardjs:my-flow' }}>
      <App />
    </OnboardingProvider>
    ```

2. **Use the `useOnboarding` hook to access onboarding state and actions:**

    ```tsx
    import { useOnboarding } from '@onboardjs/react';

    function OnboardingStep() {
      const { state, currentStep, next, previous } = useOnboarding();

      if (state.isCompleted) return <div>Onboarding complete!</div>;

      const Component = yourStepComponents[currentStep.id];

      return (
        <div>
          {Component}
          <button onClick={previous} disabled={!state.canGoPrevious}>Back</button>
          <button onClick={next} disabled={!state.canGoNext}>Next</button>
        </div>
      );
    }
    ```

---

## How It Works

- The provider creates and manages an instance of the OnboardingEngine.
- All onboarding state and actions are exposed via React context and the `useOnboarding` hook.
- You render your own UI, using your own component registry for steps.
- Persistence, event handling, and advanced configuration are supported out of the box.

---

## What’s Next

- [OnboardingProvider](/onboarding-provider): How to configure and use the provider.
- [useOnboarding Hook](/react/use-onboarding): Accessing state and actions in your components.
- [Rendering Step Content](/react/render-step-content): Customizing how steps are displayed.
- [Examples & Recipes](/react/examples): Practical usage patterns.

---

For a quick start, see the [Quickstart Guide](/).
