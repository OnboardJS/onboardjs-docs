---
title: Typed steps
nextjs:
  metadata:
    title: Typed steps
    description: Learn how to define typed onboarding steps in your application.
---

On top of the [basic step definition](/steps/defining-steps), OnboardJS provides several built-in step types with predefined payload structures to streamline common onboarding scenarios. These typed steps help ensure consistency and reduce boilerplate code.

---

## Steps with Predefined Types

A step can have a predefined type to simplify its structure and behavior. Here are some common types:

- **INFORMATION**: Displays informational content.
- **SINGLE_CHOICE**: Presents a question with a single-choice answer.
- **MULTI_CHOICE**: Presents a question with multiple-choice answers.
- **CUSTOM_COMPONENT**: Renders a custom React component.

By default, if the `type` property is left out during step definition the type will be set to `INFORMATION`.

```tsx
const step: OnboardingStep = {
  id: 'welcome',
  type: 'INFORMATION', // Step type (default)
  payload: {
    title: 'Welcome!',
    mainText: "Let's get started.",
    ctaButtonText: 'Next',
  },
}
```

Here’s what an advanced step with a different type looks like:

```tsx
const step: OnboardingStep = {
  id: 'persona-select',
  type: 'SINGLE_CHOICE',
  payload: {
    question: 'What is your role?',
    dataKey: 'userRole',
    options: [
      { id: 'dev', label: 'Developer', value: 'developer' },
      { id: 'designer', label: 'Designer', value: 'designer' },
    ],
  },
}
```

## Advanced Typed Step Features

Another advantage of using typed steps is the ability to use the same UI component for all steps of a specific type. This can greatly simplify your component logic and ensure a consistent look and feel.

### Type specific UI Components

When you have multiple steps of the same type, you can create a dedicated UI component for that type.

**For example:**

Having both the `welcome` and `thank-you` steps as `INFORMATION` type steps, you can create a dedicated UI component for them.

```typescript
{
  id: 'welcome',
  type: 'INFORMATION',
  payload: {
    title: 'Welcome!',
    mainText: "Let's get started.",
    ctaButtonText: 'Next',
  },
},
{
  id: 'thank-you',
  type: 'INFORMATION',
  payload: {
    title: 'Thank You!',
    mainText: "We're glad to have you on board.",
    ctaButtonText: 'Finish',
  },
}
```

Then in your component registry definition you can create a mapping of type for the new component.

```tsx
const componentRegistry = {
  INFORMATION: CustomInformationStep,
}
```

And finally, pass your steps and `componentRegistry` to the `OnboardingProvider`.

```tsx
<OnboardingProvider steps={steps} componentRegistry={componentRegistry}>
```

### Custom Step Types

In addition to the built-in step types, you can define your own custom step types to handle specific use cases in your onboarding flow.

Use the `CUSTOM_COMPONENT` type to create a step that should be rendered in a custom but reusable way. Then specify the `componentKey` property in the step `payload` to have that component rendered.

**For example:**

The steps definition.

```tsx
{
  id: 'custom-step',
  type: 'CUSTOM_COMPONENT',
  payload: {
    componentKey: 'MyCustomComponent',
    props: {
      // Custom props for your component
    },
  },
},
{
  id: 'custom-step-2',
  type: 'CUSTOM_COMPONENT',
  payload: {
    componentKey: 'MyCustomComponent',
    props: {
      // Custom props for your component
    },
  },
}
```

The component registry maps the `componentKey` to the actual React component that should be rendered for that step.

```tsx
import { MyCustomComponent } from '@/your-codebase'

const componentRegistry = {
  MyCustomComponent: MyCustomComponent,
}
```

---

**Next:**
- [Learn about the Onboarding Context & `flowData`](/onboarding-context)
