---
title: Versioning
nextjs:
  metadata:
    title: Versioning
    description: Learn how to manage versioning in OnboardJS to ensure smooth onboarding experiences across different app versions.
---

OnboardJS provides built-in support for versioning, allowing you to manage changes to your onboarding flows over time. This is especially useful when you need to update your onboarding process without disrupting the experience for users who are already in the middle of it.

---

## Defining Versions

You can define versions in your onboarding configuration using the `version` property. Each version can have its own set of steps and context structure.

```tsx
<OnboardingProvider
  version="1.0.0"
>
  <App />
</OnboardingProvider>
```


## Migration Strategy

⚠️ Under construction...
