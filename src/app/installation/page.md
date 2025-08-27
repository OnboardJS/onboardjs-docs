---
title: Installation
nextjs:
  metadata:
    title: Installation
    description: How to install and use OnboardJS in your app.
---

How to install and use OnboardJS in your app.

---

## Install the packages

Get started with OnboardJS by installing the necessary packages into your project. OnboardJS is designed to be modular, allowing you to pick the parts you need. For most React applications, you'll want the core engine and the React bindings.

The two primary packages you'll need are:

- `@onboardjs/core`: The main engine that handles the logic, state management, and flow control of your onboarding sequences.
- `@onboardjs/react`: Provides React hooks and components (like the `OnboardingProvider` and `useOnboarding` hook) to easily integrate the core engine into your React application.

```bash
npm install @onboardjs/core @onboardjs/react
```

## (Optional) Typescript support

OnboardJS is written in TypeScript and includes type definitions. If you're using TypeScript in your project, you'll get type safety and autocompletion out of the box. No extra type packages are needed for `@onboardjs/core` and `@onboardjs/react`.

## What's Next?

With OnboardJS installed, you're ready to start building your onboarding flows!

- **[Define Your Steps & Configuration &raquo;](/onboarding-config)**: Learn how to structure your onboarding flow using the `OnboardingEngineConfig`.
- **[Set up the Provider &raquo;](/react/onboarding-provider)**: Integrate the `OnboardingProvider` into your React application.
- **[Using the Hook &raquo;](/react/use-onboarding-hook)**: Leverage the `useOnboarding` hook to control and display your onboarding UI.
