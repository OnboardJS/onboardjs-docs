---
title: Persistence
nextjs:
  metadata:
    title: Persistence
    description: Persistence is essential for delivering a seamless onboarding experience. OnboardJS provides flexible, pluggable persistence mechanisms in both the core engine and the React SDK.
---

Persistence is essential for delivering a seamless onboarding experience. It ensures that users can leave and return to your app without losing their progress, and enables you to store onboarding data for analytics, compliance, or personalized experiences.

OnboardJS provides flexible, pluggable persistence mechanisms in both the core engine (`@onboardjs/core`) and the React SDK (`@onboardjs/react`). You can use built-in options like localStorage, use plugins with integrations - like [Supabase](https://supabase.co) - or integrate with your own backend.

---

## Why Persistence Matters

- **User Experience:** Users can resume onboarding after closing the browser or switching devices.
- **Data Integrity:** Prevents loss of progress due to accidental refreshes or navigation.
- **Analytics & Personalization:** Persisted context can be used for analytics or to tailor future experiences.

---

## Persistence in **@onboardjs/core**

The core engine supports persistence via three configuration functions:

| Config Option         | Type                                              | Purpose                                 |
|---------------------- |--------------------------------------------------|-----------------------------------------|
| `loadData`            | `(context) => Promise<TContext> \| TContext`     | Load persisted context/state            |
| `persistData`         | `(context) => Promise<void> \| void`              | Persist context/state                   |
| `clearPersistedData`  | `() => Promise<void> \| void`                    | Clear persisted data                    |

### Example: Local Storage Persistence

```tsx
const STORAGE_KEY = 'onboardjs:my-flow';

const config: OnboardingEngineConfig<MyContext> = {
  steps: [...],
  loadData: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  },
  persistData: (context) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  },
  clearPersistedData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
```

- `loadData` is called when the engine initializes.
- `persistData` is called after each context update or navigation.
- `clearPersistedData` is called on reset or flow completion.

---

## Persistence in **@onboardjs/react**

The React SDK makes persistence even easier with the `localStoragePersistence` prop on `OnboardingProvider`. You can also provide custom handlers.

### Using Local Storage (Recommended for Most Apps)

```tsx
<OnboardingProvider
  steps={steps}
  localStoragePersistence={{
    key: 'onboardjs:my-flow',
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (optional)
  }}
>
  <App />
</OnboardingProvider>
```

- **`key`**: The localStorage key to use.
- **`ttl`**: Optional time-to-live in milliseconds. Expired data is cleared automatically.

### Custom Persistence Handlers

You can provide your own persistence logic using these props:

- `customOnDataLoad?: () => Promise<TContext> \| TContext`
- `customOnDataPersist?: (context: TContext) => Promise<void> \| void`
- `customOnClearPersistedData?: () => Promise<void> \| void`

**Example: Persisting to Supabase**

```tsx
<OnboardingProvider
  steps={steps}
  customOnDataLoad={async () => {
    const { data } = await supabase
      .from('onboarding')
      .select('context')
      .eq('user_id', user.id)
      .single();
    return data?.context || undefined;
  }}
  customOnDataPersist={async (context) => {
    await supabase
      .from('onboarding')
      .upsert({ user_id: user.id, context });
  }}
  customOnClearPersistedData={async () => {
    await supabase
      .from('onboarding')
      .delete()
      .eq('user_id', user.id);
  }}
>
  <App />
</OnboardingProvider>
```

---

## Best Practices

- **Keep context serializable:** Avoid non-serializable values (functions, class instances) in your context.
- **Version your data:** If your onboarding flow changes, use a version field to handle migrations.
- **Handle partial/incomplete flows:** Check for incomplete context and guide users accordingly.
- **Secure sensitive data:** Don’t store secrets or sensitive information in localStorage.
- **Clear data on completion:** Use `clearPersistedData` or equivalent to remove onboarding data when the flow is finished.

---

## Troubleshooting

- **Corrupted State:** If `loadData` returns invalid or corrupted data, reset the onboarding flow and clear persisted data.
- **Persistence Not Working:** Ensure your `persistData`/`customOnDataPersist` functions are being called (check for errors in the console).
- **Multiple Flows:** Use unique storage keys for different onboarding flows or user segments.

---

## Example: Full Persistence Flow

```tsx
const STORAGE_KEY = 'onboardjs:my-flow';

const config: OnboardingEngineConfig<MyContext> = {
  steps: [...],
  loadData: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  },
  persistData: (context) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  },
  clearPersistedData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  onFlowComplete: (context) => {
    // Optionally clear data or archive context
    localStorage.removeItem(STORAGE_KEY);
  },
};
```

---

## Summary

- OnboardJS supports flexible persistence via config functions and React provider props.
- Use localStorage for simple cases, or integrate with your backend for advanced needs.
- Always keep context serializable and secure.
- Clear persisted data when onboarding is complete or reset.

For more, see [The Onboarding Context](/onboarding-context) and [OnboardingProvider](/react/onboarding-provider).
