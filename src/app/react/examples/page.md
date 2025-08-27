---
title: Examples & Recipes
nextjs:
  metadata:
    title: Examples & Recipes
    description: Practical examples and recipes for using OnboardJS in React applications.
---

This page provides practical examples and recipes for using OnboardJS in your React applications. See how to implement common onboarding patterns, customize step rendering, persist progress, and more.

---

## 1. Basic Linear Onboarding Flow

```tsx
import { type OnboardingStep, OnboardingProvider, useOnboarding } from '@onboardjs/react'

// Define the onboarding steps
const steps: OnboardingStep[] = [
  {
    id: 'welcome',
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
  { id: 'done', payload: { title: 'All set!' }, nextStep: null },
]

const componentRegistry = {
  welcome: ({ payload }) => <div>{payload.title}</div>,
  done: ({ payload }) => <div>{payload.title}</div>,
  SINGLE_CHOICE: ({ payload, next }) => (
    <div>
      <h2>{payload.question}</h2>
      {payload.options.map((option) => (
        <button key={option.id} onClick={() => next({ answer: option.value })}>
          {option.label}
        </button>
      ))}
    </div>
  ),
}

function OnboardingUI() {
  const { currentStep, state, next, previous, renderStep } = useOnboarding()

  if (state.isCompleted) return <div>Onboarding complete!</div>

  return (
    <div>
      {renderStep()}
      <div>
        <button onClick={() => previous()} disabled={!state.canGoPrevious}>
          Back
        </button>
        <button onClick={() => next()} disabled={!state.canGoNext}>
          Next
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
      <OnboardingUI />
    </OnboardingProvider>
  )
}
```

---

## 2. Branching Flow Based on User Input

```tsx
const steps = [
  {
    id: 'start',
    type: 'INFORMATION',
    payload: { title: 'Start' },
    nextStep: 'choose',
  },
  {
    id: 'choose',
    type: 'SINGLE_CHOICE',
    payload: {
      question: 'Are you a developer?',
      dataKey: 'isDeveloper',
      options: [
        { id: 'yes', label: 'Yes', value: true },
        { id: 'no', label: 'No', value: false },
      ],
    },
    nextStep: (context) =>
      context.flowData.answers?.isDeveloper ? 'dev-setup' : 'user-setup',
  },
  {
    id: 'dev-setup',
    type: 'INFORMATION',
    payload: { title: 'Dev Setup' },
    nextStep: 'done',
  },
  {
    id: 'user-setup',
    type: 'INFORMATION',
    payload: { title: 'User Setup' },
    nextStep: 'done',
  },
  { id: 'done', type: 'INFORMATION', payload: { title: 'Finished!' } },
]
```

---

## 3. Custom Step Component

```tsx
function CustomSurveyStep({ step, payload, next, updateContext }) {
  const [answer, setAnswer] = React.useState('')

  const handleSubmit = () => {
    updateContext({ flowData: { survey: answer } })
  }

  return (
    <div>
      <h2>{payload.title}</h2>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={handleSubmit}>Continue</button>
    </div>
  )
}

const steps: OnboardingStep[] = [
  {
    id: 'custom-survey',
  },
]

const componentRegistry = {
  'custom-component': CustomSurveyStep,
  // ...other mappings
}

<OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
  {/** Render the onboarding UI with custom components like above */}
  <OnboardingUI />
</OnboardingProvider>
```

---

## 4. Persisting Progress with localStorage

```tsx
<OnboardingProvider
  steps={steps}
  localStoragePersistence={{
    key: 'onboardjs:my-onboarding',
    ttl: 1000 * 60 * 60 * 24, // 1 day
  }}
>
  <OnboardingUI />
</OnboardingProvider>
```

---

## 5. Integrating remote data sources

```tsx
<OnboardingProvider
  steps={steps}
  customOnDataLoad={async () => {
    const { data } = await supabase
      .from('onboarding')
      .select('context')
      .eq('user_id', user.id)
      .single()
    return data?.context || undefined
  }}
  customOnDataPersist={async (context) => {
    await supabase.from('onboarding').upsert({ user_id: user.id, context })
  }}
  customOnClearPersistedData={async () => {
    await supabase.from('onboarding').delete().eq('user_id', user.id)
  }}
>
  <OnboardingUI />
</OnboardingProvider>
```

---

## 6. Handling Flow Completion

```tsx
<OnboardingProvider
  steps={steps}
  onFlowComplete={(context) => {
    // Send analytics, redirect, or show a custom message
    console.log('Onboarding finished!', context)
    toast('Onboarding Complete!', {
      description: `Welcome, ${context.flowData?.userName || 'friend'}! You're all set.`,
      duration: 3000,
    })
  }}
>
  <OnboardingUI />
</OnboardingProvider>
```

---

## 7. Using Checklist Steps

```tsx
const steps = [
  {
    id: 'checklist',
    type: 'CHECKLIST',
    payload: {
      dataKey: 'setupTasks',
      items: [
        { id: 'profile', label: 'Complete your profile', isMandatory: true },
        { id: 'invite', label: 'Invite a teammate', isMandatory: false },
      ],
      minItemsToComplete: 1,
    },
    nextStep: 'done',
  },
  { id: 'done', type: 'INFORMATION', payload: { title: 'All done!' } },
]
```

---

## 8. Customizing Navigation Buttons

```tsx
function CustomNav() {
  const { state, next, previous, skip } = useOnboarding()

  return (
    <div>
      <button onClick={() => previous()} disabled={!state.canGoPrevious}>
        Back
      </button>
      {state.isSkippable && <button onClick={() => skip()}>Skip</button>}
      <button onClick={() => next()} disabled={!state.canGoNext}>
        Next
      </button>
    </div>
  )
}
```

---

## 9. Accessing and Updating Context

```tsx
function ShowUserName() {
  const { state, updateContext } = useOnboarding()

  return (
    <div>
      <p>User: {state.context.currentUser?.name}</p>
      <button onClick={() => updateContext({ currentUser: { name: 'Soma' } })}>
        Set Name to Soma
      </button>
    </div>
  )
}
```

---

## 10. Resetting the Onboarding Flow

```tsx
function ResetButton() {
  const { reset } = useOnboarding()

  return <button onClick={() => reset()}>Restart Onboarding</button>
}
```

---

## More Recipes

More recipes are coming soon! If you have specific use cases or patterns you'd like to see, please open an issue on our [GitHub repository](https://github.com/Somafet/onboardjs/issues).
