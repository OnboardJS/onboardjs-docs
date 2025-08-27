---
title: Defining steps
nextjs:
  metadata:
    title: Defining steps
    description: Learn how to define onboarding steps in your application.
---

Steps are the building blocks of your onboarding flow in OnboardJS. Each step represents a screen, question, or action the user will encounter. You define your steps as an array of objects, each with a unique `id`, a `type`, and a `payload` describing the content or behavior of the step.

---

## Basic Step Structure

Here’s what a typical step looks like:

```tsx
const step: OnboardingStep = {
  id: "welcome", // Unique identifier for this step
  type: "INFORMATION", // The kind of step (see below for common types)
  payload: {
    title: "Welcome!",
    mainText: "Let's get started.",
    ctaButtonText: "Next",
  },
  nextStep: "profile", // (Optional) The id of the next step
  previousStep: null,  // (Optional) The id of the previous step
};
```

## Common Step Types

- **INFORMATION**: Show a message, image, or instructions.
- **SINGLE_CHOICE**: Present a question with multiple options (radio buttons).
- **MULTIPLE_CHOICE**: Present a question with multiple selectable options (checkboxes).
- **CHECKLIST**: Show a list of tasks for the user to complete.
- **CUSTOM_COMPONENT**: Render your own React component for custom UI or logic.

You can define your own types as well—OnboardJS is headless and type-agnostic.

## Example: Minimal Steps Array

```tsx
const steps: OnboardingStep[] = [
  {
    id: "welcome",
    type: "INFORMATION",
    payload: {
      title: "Welcome to the App!",
      mainText: "Let's get you set up.",
      ctaButtonText: "Start",
    },
    nextStep: "choose-role",
  },
  {
    id: "choose-role",
    type: "SINGLE_CHOICE",
    payload: {
      question: "What is your role?",
      dataKey: "userRole",
      options: [
        { id: "dev", label: "Developer", value: "developer" },
        { id: "designer", label: "Designer", value: "designer" },
      ],
    },
    nextStep: "finish",
    previousStep: "welcome",
  },
  {
    id: "finish",
    type: "INFORMATION",
    payload: {
      title: "You're all set!",
      mainText: "Enjoy using the app.",
      ctaButtonText: "Done",
    },
    previousStep: "choose-role",
    nextStep: null, // End of flow
  },
];
```

## Advanced Step Features

### Dynamic Navigation

You can use a function for `nextStep` or `previousStep` to determine the next step based on the current context:

```tsx
{
  id: "figma-choose-role",
  type: "SINGLE_CHOICE",
  payload: { /* ... */ },
  nextStep: (context) => context.flowData.userRole === "developer" ? "dev-setup" : "designer-setup",
}
```

### Conditional Steps

Use the `condition` property to show or skip a step based on the context:

```tsx
{
  id: "dev-setup",
  type: "INFORMATION",
  payload: { title: "Developer Setup", mainText: "..." },
  condition: (context) => context.flowData.userRole === "developer",
}
```

### Custom Components

For complex UI, use `type: "CUSTOM_COMPONENT"` and provide a `componentKey` in the payload:

```tsx
{
  id: "profile-form",
  type: "CUSTOM_COMPONENT",
  payload: {
    componentKey: "ProfileForm", // You map this to your React component
    title: "Set up your profile",
  },
  nextStep: "finish",
}
```

## Best Practices

- **Unique IDs**: Every step must have a unique `id`.
- **Keep it modular**: Break complex flows into small, focused steps.
- **Use `flowData`**: Store user answers and flags in `context.flowData` for use in navigation and conditions.
- **Use `condition` for personalization**: Show or skip steps based on previous answers.
- **Use `CUSTOM_COMPONENT` for advanced UI**: When you need more than the built-in step types.

---

**Next:** [Learn about the Onboarding Context & `flowData`](/onboarding-context)
