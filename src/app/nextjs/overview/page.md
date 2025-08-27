---
title: Using OnboardJS in a Next.js Project
nextjs:
  metadata:
    title: Using OnboardJS in a Next.js Project
    description: Learn how to integrate OnboardJS with Next.js applications using the @onboardjs/react package. This guide covers key features, usage patterns, and how to manage onboarding flows in your Next.js projects.
---

OnboardJS integrates smoothly with both the **App Router** (`app/` directory) and the **Pages Router** (`pages/` directory) in Next.js projects. This overview explains how to set up OnboardJS in either structure, with best practices for state management, persistence, and SSR considerations.

---

## Installation

Install the React SDK and core engine:

```bash
npm install @onboardjs/react @onboardjs/core
```

---

## Using OnboardJS with the App Router (**app/** Directory)

The App Router uses React Server Components by default, but OnboardJS should be used in **Client Components** only.

### Basic Setup

1. **Create your steps configuration** (e.g., `onboardingSteps.ts`):

   ```tsx
   // app/onboardingSteps.ts
   export const steps = [
     {
       id: 'welcome',
       type: 'INFORMATION',
       payload: { title: 'Welcome!' },
       nextStep: 'profile',
     },
     {
       id: 'profile',
       type: 'SINGLE_CHOICE',
       payload: {
         question: 'Your role?',
         options: [{ id: 'dev', label: 'Developer', value: 'dev' }],
       },
       nextStep: 'done',
     },
     { id: 'done', type: 'INFORMATION', payload: { title: 'All set!' } },
   ]
   ```

2. **Create a client onboarding UI component**:

    ```tsx
    // app/onboarding/OnboardingUI.tsx
    'use client'

    import { useOnboarding } from '@onboardjs/react'

    export function OnboardingUI() {
      const { currentStep, state, next, previous } = useOnboarding()

      if (state.isCompleted) return <div>Onboarding complete!</div>

      const Component =
        yourComponentRegistry[
          currentStep.payload.componentKey ?? currentStep.type ?? currentStep.id
        ]

      if (!Component) {
        return <div>Unknown step</div>
      }

      return (
        <div>
          <Component
            payload={currentStep.payload}
            coreContext={state.context}
            onDataChange={() => {}}
          />
          <div>
            <button onClick={previous} disabled={!state.canGoPrevious}>
              Back
            </button>
            <button onClick={next} disabled={!state.canGoNext}>
              Next
            </button>
          </div>
        </div>
      )
    }
    ```

3. **Wrap your UI with `OnboardingProvider` in a client component**:

   ```tsx
   // app/onboarding/page.tsx
   'use client'

   import { OnboardingProvider } from '@onboardjs/react'
   import { steps } from '../onboardingSteps'
   import { OnboardingUI } from './OnboardingUI'

   export default function OnboardingPage() {
     return (
       <OnboardingProvider
         steps={steps}
         localStoragePersistence={{ key: 'onboardjs:my-flow' }}
       >
         <OnboardingUI />
       </OnboardingProvider>
     )
   }
   ```

**Tips:**

- Always use `'use client'` at the top of any file that uses OnboardJS hooks or context.
- You can place the provider at any level (e.g., in a layout or a specific page).

---

## Using OnboardJS with the Pages Router (**pages/** Directory)

The Pages Router uses classic React components and works seamlessly with OnboardJS.

### Basic Setup

1. **Create your steps configuration** (e.g., `onboardingSteps.ts`):

   ```tsx
   // pages/onboardingSteps.ts
   export const steps = [
     {
       id: 'welcome',
       type: 'INFORMATION',
       payload: { title: 'Welcome!' },
       nextStep: 'profile',
     },
     {
       id: 'profile',
       type: 'SINGLE_CHOICE',
       payload: {
         question: 'Your role?',
         options: [{ id: 'dev', label: 'Developer', value: 'dev' }],
       },
       nextStep: 'done',
     },
     { id: 'done', type: 'INFORMATION', payload: { title: 'All set!' } },
   ]
   ```

2. **Create your onboarding UI component**:

    ```tsx
    // pages/onboarding/OnboardingUI.tsx
    import { useOnboarding } from '@onboardjs/react'

    export function OnboardingUI() {
      const { currentStep, state, next, previous } = useOnboarding()

      if (state.isCompleted) return <div>Onboarding complete!</div>

      const Component =
        yourComponentRegistry[
          currentStep.payload.componentKey ?? currentStep.type ?? currentStep.id
        ]

      if (!Component) {
        return <div>Unknown step</div>
      }

      return (
        <div>
          <Component
            payload={currentStep.payload}
            coreContext={state.context}
            onDataChange={() => {}}
          />
          <div>
            <button onClick={previous} disabled={!state.canGoPrevious}>
              Back
            </button>
            <button onClick={next} disabled={!state.canGoNext}>
              Next
            </button>
          </div>
        </div>
      )
    }
    ```

3. **Wrap your UI with `OnboardingProvider` in your page component**:

   ```tsx
   // pages/onboarding/index.tsx
   import { OnboardingProvider } from '@onboardjs/react'
   import { steps } from '../onboardingSteps'
   import { OnboardingUI } from './OnboardingUI'

   export default function OnboardingPage() {
     return (
       <OnboardingProvider
         steps={steps}
         localStoragePersistence={{ key: 'onboardjs:my-flow' }}
       >
         <OnboardingUI />
       </OnboardingProvider>
     )
   }
   ```

---

## Persistence and SSR Considerations

- **Persistence:**  
  Use the `localStoragePersistence` prop for client-side persistence, or provide custom handlers for backend persistence (e.g., Supabase, Neon).
- **SSR:**  
  OnboardJS is designed for client-side onboarding flows. Do not use OnboardJS hooks or context in server components or `getServerSideProps`.
- **Hydration:**  
  If you need to pre-populate onboarding context from the server, pass it as `initialContext` to the provider.

---

## Advanced: Custom Step Components and Dynamic Flows

- Use a `componentRegistry` map to map step types or keys to your own React components.
- You can generate steps dynamically based on user data or API responses before rendering the provider.

---

## Example: Integrating with Supabase in Next.js

```tsx
// app/onboarding/page.tsx or pages/onboarding/index.tsx
'use client';

import { OnboardingProvider } from '@onboardjs/react';
import { steps } from '../onboardingSteps';
import { OnboardingUI } from './OnboardingUI';
import { supabase } from '../lib/supabaseClient';

export default function OnboardingPage() {
  return (
    <OnboardingProvider
      steps={steps}
      customOnDataLoad={async () => {
        const { data } = await supabase
          .from('onboarding')
          .select('context')
          .eq('user_id', /* your user id */)
          .single();
        return data?.context || undefined;
      }}
      customOnDataPersist={async (context) => {
        await supabase
          .from('onboarding')
          .upsert({ user_id: /* your user id */, context });
      }}
      customOnClearPersistedData={async () => {
        await supabase
          .from('onboarding')
          .delete()
          .eq('user_id', /* your user id */);
      }}
    >
      <OnboardingUI />
    </OnboardingProvider>
  );
}
```

---

## Summary

- OnboardJS works with both the App Router and Pages Router in Next.js.
- Always use OnboardJS in client components.
- Wrap your onboarding UI with `OnboardingProvider` and use the `useOnboarding` hook for state and actions.
- Use localStorage or custom persistence as needed.
- For advanced flows, leverage the component registry and dynamic step generation.

For more, see the [Quickstart Guide](/) and [React SDK Overview](/react/overview).
