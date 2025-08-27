---
title: Getting started
---

Learn how to get OnboardJS set up in your project in under thirty minutes. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/installation" description="Step-by-step guide for installing the library and setting up a basic flow." /%}

{% quick-link title="Core concepts" icon="presets" href="/what-is-onboardjs" description="Learn how the internals work." /%}

{% quick-link title="Plugins" icon="plugins" href="/plugins/overview" description="Extend the library with third-party plugins or write your own." /%}

{% quick-link title="React" icon="theming" href="/react/overview" description="Learn how easy it is to integrate OnboardJS into a React project." /%}

{% /quick-links %}

Welcome to OnboardJS! This guide will help you quickly integrate flexible and powerful onboarding flows into your React application.

---

## Quick start

OnboardJS provides a core engine for defining and managing onboarding logic, and a React SDK (`@onboardjs/react`) for easily integrating this engine into your UI.

### Installing dependencies

First, install the necessary packages. You'll need the core engine and the React bindings.

```bash
npm install @onboardjs/core @onboardjs/react
```

The `@onboardjs/core` package contains the core logic for defining and managing onboarding flows, while `@onboardjs/react` provides React components and hooks to integrate the engine into your application.

### Define onboarding steps

The heart of OnboardJS is its configuration, where you define the steps of your onboarding flow. Each step has an `id`, `type`, and a `payload` specific to its type.

Create a file for your onboarding configuration, for example, `src/lib/onboarding-config.ts`:

```tsx
import { OnboardingEngineConfig, OnboardingStep } from '@onboardjs/core'

// Define your steps
export const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    type: 'INFORMATION', // A simple informational step
    payload: {
      title: 'Welcome to Our App!',
    },
  },
  {
    id: 'profile-details',
    type: 'CUSTOM_COMPONENT', // A step that renders your own React component
    payload: {
      componentKey: 'ProfileSetupForm', // A key to identify which custom component to render
      title: 'Complete Your Profile',
    },
    nextStep: 'finish', // You can specify the next step by ID
  },
  {
    id: 'finish',
    type: 'INFORMATION',
    payload: {
      title: 'Setup Complete!',
    },
    nextStep: null, // null indicates the end of the flow
  },
]

// Define your Component Registry
export const componentRegistry = {
  // Map every INFORMATION step to a simple informational component
  INFORMATION: InformationStepComponent,
  // Map CUSTOM_COMPONENT based on the componentKey
  ProfileSetupForm: ProfileSetupFormComponent,
  // Override the default INFORMATION component by providing the ID instead
  finish: FinishStepComponent,
}
```

{% callout title="You should know!" %}
Omitting `nextStep` in a step allows the engine to automatically navigate to the next step after the current one is completed. If you want to control navigation manually, you can provide this field to specify the next step's ID.
{% /callout %}

---

## Basic usage

Once you have your onboarding steps defined, you can integrate the onboarding flow into your React application.

### Set up the OnboardingProvider

Wrap your application (or the relevant part of it) with the `OnboardingProvider`. This provider initializes the OnboardingEngine and makes the onboarding state and actions available to your components via a React Context.

```tsx
// src/App.tsx or your main application file
import React from 'react'
import { OnboardingProvider } from '@onboardjs/react'
import { steps, componentRegistry } from './onboarding-config' // Your config from the previous step
import YourMainAppComponent from './YourMainAppComponent' // Your actual app content

function App() {
  return (
    <OnboardingProvider
      steps={steps}
      componentRegistry={componentRegistry}
      onFlowComplete={(context) => {
        console.log('Onboarding flow completed!', context)
        // Perform actions like redirecting the user, setting a flag, etc.
      }}
      onStepChange={(newStep, oldStep, context) => {
        console.log('Step changed:', oldStep?.id, '->', newStep?.id)
      }}
      // Optional: Enable localStorage persistence
      localStoragePersistence={{ key: 'myAppOnboardingState' }}
    >
      <YourMainAppComponent />
    </OnboardingProvider>
  )
}

export default App
```

{% callout title="Next.js Ready!" %}
For more information on how to use OnboardJS with Next.js, check out the [Next.js guide](/nextjs/overview).
{% /callout %}

### Create your UI components for Onboarding steps

OnboardJS is "headless" by default, meaning it provides the logic, and you provide the UI. You'll typically create a component that consumes the onboarding context and renders the current steps.

**Custom Step Components**

```tsx
// src/components/onboarding/ProfileSetupFormComponent.tsx
import React from 'react'
import { StepComponentProps, useOnboarding } from '@onboardjs/react'

type TypedPayload = {
  title?: string
  description?: string
}

// Props will include the current step and its payload
const ProfileSetupFormComponent: React.FC<StepComponentProps<TypedPayload>> = ({
  // step, // The current step object
  payload,
}) => {
  const { next, updateContext } = useOnboarding()

  const handleSubmit = async () => {
    // Simulate form submission
    await updateContext({ flowData: { profileComplete: true } })
    await next() // Proceed to the next step
  }

  return (
    <div>
      <h2>{payload?.title || 'Profile Setup'}</h2>
      <p>Please fill in your details...</p>
      {/* Your form fields here */}
      <button onClick={handleSubmit}>Save and Continue</button>
    </div>
  )
}

export default ProfileSetupFormComponent
```

### Render the onboarding flow

Now, you can create a component that renders the current step based on the onboarding context.

```tsx
// src/components/onboarding/OnboardingFlow.tsx
import React from 'react'
import { useOnboarding } from '@onboardjs/react'

// Define your component registry
// This maps step types or componentKeys to your React components
const componentRegistry = {
  ProfileSetupForm: React.lazy(() => import('./ProfileSetupFormComponent')),
  // Add more components as needed
}

export const OnboardingFlowPresenter: React.FC = () => {
  const { currentStep, state, isLoading, isCompleted, next, previous, skip, renderStep } =
    useOnboarding()

  if (!state) {
    // The state is not initialized yet, possibly loading from localStorage or your data source
    return <div>Loading Onboarding...</div>
  }

  if (isCompleted) {
    // Flow is done!
    // You might want to hide this component or show a completion message
    // if not handled by onFlowComplete redirecting.
    return null
  }

  return (
    <div className="onboarding-modal-or-container">
      {/* Render the content for the current step */}
      {renderStep()}

      <div
        className="onboarding-navigation"
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button onClick={() => previous()}>Previous</button>
        <button onClick={() => skip()}>Skip</button>

        {/* The primary action button often comes from the step's payload or is 'Next' */}

        <button onClick={() => next()}>
          {currentStep.payload.ctaButtonText ?? "Next"}
        </button>
      </div>
      {/* Optional: Display progress */}
      <div>Step {state.currentStepNumber} of {state.totalSteps}</div>
    </div>
  )
}
```

---

### Using the Onboarding UI

Now, include your `OnboardingFlowPresenter` (or similar UI component) in your application where you want the onboarding to appear. This could be a modal, a dedicated page, or embedded within a section.
```tsx
// src/YourMainAppComponent.tsx
import React from "react";
import { OnboardingFlowPresenter } from "./components/OnboardingFlowPresenter";
import { useOnboarding } from "@onboardjs/react"; // To potentially hide presenter when completed

const YourMainAppComponent = () => {
  const { isCompleted } = useOnboarding(); // Get completion state

  return (
    <div>
      <h1>My Awesome Application</h1>
      {/* Conditionally render the onboarding flow */}
      {!isCompleted && <OnboardingFlowPresenter />}
      
      <p>Rest of your application content...</p>
      {/* Example: Show a button to reset onboarding for testing */}
    </div>
  );
};

export default YourMainAppComponent;
```

## Key Concepts Recap

*   **`OnboardingEngineConfig<TContext>`**: Defines your steps, initial state, and callbacks.
*   **`OnboardingStep<TContext>`**: Represents a single screen/interaction in your flow. Key properties: `id`, `type`, `payload`, `next`, `previous`, `condition`.
*   **`OnboardingProvider`**: Initializes the engine and provides context to your app.
*   **`useOnboarding()` Hook**: Accesses the engine's state (`currentStep`, `isLoading`, `isCompleted`, etc.) and actions (`next`, `previous`, `reset`, etc.).

## Next Steps

*   **Explore Step Types**: OnboardJS supports various step types like `INFORMATION`, `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `CHECKLIST`, `FORM_STEP`, and `CUSTOM_COMPONENT`.
*   **Conditional Logic**: Use the `condition` property on steps to show/hide them based on the current `context.flowData`.
*   **Dynamic Navigation**: Use functions for `next` or `previous` for complex routing.
*   **Persistence**: Implement `customOnDataLoad` and `customOnDataPersist` for backend storage if `localStoragePersistence` isn't sufficient.
*   **Plugins**: Extend functionality with plugins or create your own.
*   **Styling**: Style your onboarding components to match your application's look and feel.

This quickstart should give you a solid foundation. Dive into the more detailed documentation for advanced features and customization!
