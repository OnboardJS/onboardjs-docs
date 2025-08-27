---
title: What is OnboardJS?
nextjs:
  metadata:
    title: What is OnboardJS?
    description: OnboardJS is a flexible, headless JavaScript library designed to help you create powerful and engaging user onboarding experiences within your web applications.
---

**OnboardJS is a flexible, headless JavaScript library designed to help you create powerful and engaging user onboarding experiences within your web applications.**

At its core, OnboardJS provides a robust engine for defining, managing, and orchestrating multi-step onboarding flows. It handles the logic, state, and navigation, allowing you to focus on building the perfect user interface to guide your users.

---

## Why OnboardJS?

User onboarding is critical for product adoption and user success. A great onboarding experience can significantly reduce churn, increase feature discovery, and help users achieve their "aha!" moment faster. OnboardJS aims to make building these experiences easier and more maintainable.

{% quick-links %}

{% quick-link title="Powerful Configuration" icon="installation" description="OnboardJS is 'headless,' meaning it provides the underlying logic and state management without dictating how your onboarding UI should look or behave. You have complete control to build UIs that perfectly match your application's design using any framework or styling solution." /%}

{% quick-link title="Architecture guide" icon="presets" description="Define complex onboarding flows with conditional logic, dynamic step navigation, and custom data collection using a clear and declarative configuration object. Tailor the experience to different user segments or based on user actions." /%}

{% quick-link title="Plugins" icon="plugins" description="Extend the core functionality or integrate with third-party services through a simple plugin system. (More on this in the Plugins section!)" /%}

{% quick-link title="Event-Driven" icon="theming" description="React to key moments in the onboarding lifecycle (e.g., step changes, flow completion) using a built-in event system. This is perfect for analytics, triggering side effects, or updating other parts of your application." /%}

{% /quick-links %}

## Core Components

Understanding these pieces will help you get the most out of OnboardJS:

*   **Onboarding Engine (`@onboardjs/core`)**: The brain of the operation. It processes your configuration, manages state, handles navigation, and emits events. It can be used standalone or with an SDK.
*   **Configuration**: A JavaScript object where you define all your onboarding `steps`, their content, logic, and how they connect.
*   **Steps**: Individual screens or interactions within your onboarding flow (e.g., a welcome message, a feature explanation, a choice prompt, a form).
*   **Context & `flowData`**: An object holding the current state of the onboarding, including any data input by the user or relevant to the flow's progression.
*   **React SDK (`@onboardjs/react`)**: Provides tools like `OnboardingProvider` and the `useOnboarding` hook to make it easy to use the engine in React applications and build your UI.

## Who is OnboardJS For?

OnboardJS is for developers who want to:

*   Create tailored and interactive onboarding experiences.
*   Separate onboarding logic from UI presentation.
*   Build complex flows with conditional paths.
*   Integrate onboarding smoothly into existing React (or other JavaScript) applications.
*   Have a maintainable and testable way to manage user onboarding.

## Ready to Get Started?

Dive into the **[Installation](/installation)** guide to add OnboardJS to your project, or check out the **[Quickstart Guide](/)** for a rapid introduction to building your first flow.
