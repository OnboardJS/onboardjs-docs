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
  payload: {
    title: "Welcome!",
    mainText: "Let's get started.",
    ctaButtonText: "Next",
  },
  nextStep: "profile", // (Optional) The id of the next step
  previousStep: null,  // (Optional) The id of the previous step
};
```

## Example: Minimal Steps Array

```tsx
const steps: OnboardingStep[] = [
  {
    id: "welcome",
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
  payload: { /* ... */ },
  nextStep: (context) => context.flowData.userRole === "developer" ? "dev-setup" : "designer-setup",
}
```

### Conditional Steps

Use the `condition` property to show or skip a step based on the context:

```tsx
{
  id: "dev-setup",
  payload: { title: "Developer Setup" },
  condition: (context) => context.flowData.userRole === "developer",
},
{
  id: "admin-setup",
  payload: { title: "Admin Setup" },
  condition: (context) => context.flowData.userRole === "admin",
}
```

## Best Practices

- **Unique IDs**: Every step must have a unique `id`.
- **Keep it modular**: Break complex flows into small, focused steps.
- **Use `flowData`**: Store user answers and flags in `context.flowData` for use in navigation and conditions.
- **Use `condition` for personalization**: Show or skip steps based on previous answers.

---
**Next:**
- [Learn about step types](/steps/typed-steps)
- [Learn about the Onboarding Context & `flowData`](/onboarding-context)
