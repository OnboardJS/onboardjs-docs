---
title: Supabase Persistence Plugin
nextjs:
  metadata:
    title: Supabase Persistence Plugin
    description: Seamlessly integrate OnboardJS with Supabase for robust, user-specific onboarding state persistence.
---
{% link href="https://supabase.com" target="_blank" %}
  {% supabase-icon height="50px" width="auto" /%}
{% /link %}

The easiest way to persist your OnboardJS flow data directly to your Supabase backend,
ensuring users never lose progress and their onboarding journey is always seamless.

---

## Why Supabase for Onboarding Persistence?

**Did you know** that every time a user refreshes the page or switches devices, they could lose their onboarding progress if it's not properly persisted? This leads to frustration, drop-offs, and missed opportunities.

Supabase offers a powerful, PostgreSQL-backed solution that's perfect for storing dynamic user data like onboarding flow state. With real-time capabilities and robust authentication, it's a natural fit for building personalized, durable user experiences.

The OnboardJS Supabase plugin handles all the tedious plumbing, so you can focus on designing great user journeys, not database operations.

### Key Benefits

- **Seamless User Experience:** Users can close their browser or switch devices and resume exactly where they left off.
- **Reliable Data Storage:** Leverage PostgreSQL's stability and Supabase's ease of use for your flow data.
- **User-Specific State:** Automatically tie onboarding progress to your authenticated Supabase users.
- **Analytics & Personalization:** Collect rich data on user journeys to inform future product decisions and tailor experiences.
- **Reduced Boilerplate:** No more writing custom `loadData`, `persistData`, or `clearData` functions for your backend.

## Installation

First, install the plugin package:

```bash
npm install @onboardjs/supabase-plugin
# or
yarn add @onboardjs/supabase-plugin
```

## Setup & Usage

The Supabase Persistence Plugin integrates directly with your `OnboardingProvider` in `@onboardjs/react` or directly with the `OnboardingEngine` in `@onboardjs/core`.

Before you start:

1. **Supabase Client**: Ensure you have a Supabase client instance initialized in your application.
2. **Database Table**: Create a table in your Supabase project to store the onboarding state. A basic schema might look like this:

```sql
CREATE TABLE onboarding_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  flow_data JSONB, -- Stores the JSON representation of your OnboardingContext
  created_at TIMESTANDZ DEFAULT NOW(),
  updated_at TIMESTANDZ DEFAULT NOW()
);

-- Optional: RLS policies to allow users to read/write their own state
-- For authenticated users:
ALTER TABLE onboarding_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own onboarding state."
  ON onboarding_state FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own onboarding state."
  ON onboarding_state FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own onboarding state."
  ON onboarding_state FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

## 1. Configure the Plugin

The plugin's configuration options allow you to tailor it to your Supabase setup and how you manage user IDs.

```tsx
import { createSupabasePlugin } from '@onboardjs/supabase-plugin'

// Example usage:
const supabaseClient = createClient() // Your Supabase client instance

const supabasePlugin = createSupabasePlugin<YourAppContext>({
  client: supabaseClient,
  tableName: 'onboarding_progress', // Matches your table name
  userIdColumn: 'user_id', // Matches your user ID column
  stateDataColumn: 'flow_data', // Matches your state data column
  useSupabaseAuth: true, // Recommended: Automatically link to Supabase authenticated user
  onError: (error, operation) => {
    console.error(`[SupabasePlugin] Error during ${operation}:`, error.message)
    // You might want to send this to a dedicated error tracking service
  },
})
```

## 2. Add to Your OnboardingProvider (React)

Once configured, pass the `supabasePlugin` instance to the `plugins` array of your `OnboardingProvider`.

```tsx
// src/components/OnboardingProviderWrapper.tsx
'use client' // Important for Next.js App Router

import React from 'react'
import { OnboardingProvider } from '@onboardjs/react'
import { createSupabasePlugin } from '@onboardjs/supabase-plugin'
import { createClient } from '@/lib/supabase' // Your Supabase client setup
import { type User } from '@supabase/auth-js' // Supabase user type
import { OnboardingContext } from '@onboardjs/core' // Core OnboardingContext

// Define your App's custom OnboardingContext
interface AppOnboardingContext extends OnboardingContext {
  currentUser?: User // This field will be populated by the plugin if `useSupabaseAuth: true`
  // ... other application-specific context properties
}

// Your common flow steps and component registry would be imported here
// import { commonFlowSteps, commonRegistry } from "./common-flow-config";

export default function OnboardingProviderWrapper({
  user, // (Optional) Pass the Supabase authenticated user from your auth context/layout
  children,
}: Readonly<{
  user: User | null
  children: React.ReactNode
}>) {
  const client = createClient() // Initialize your Supabase client

  // Create the Supabase plugin instance
  const supabasePlugin = createSupabasePlugin<AppOnboardingContext>({
    client,
    tableName: 'onboarding_progress',
    userIdColumn: 'user_id',
    stateDataColumn: 'flow_data',
    useSupabaseAuth: true, // Crucial: plugin will fetch and use auth.getUser().id
    onError(error, operation) {
      console.error(
        `[SupabasePlugin] Error during ${operation}:`,
        error.message,
      )
    },
  })

  // Pass the Supabase user to the initial context if available.
  // The plugin will ensure `context.currentUser` is set from Supabase Auth data.
  // This helps when the engine first loads, ensuring `currentUser` is present.
  const initialContextWithUser: Partial<AppOnboardingContext> = {
    // Other initial flowData or context you need
    flowData: {
      selectedOption: 'default-flow',
    },
    // Initialize currentUser from external props, if available.
    // The plugin will overwrite/confirm this with fetched Supabase auth data.
    currentUser: user ?? undefined,
  }

  return (
    <OnboardingProvider<AppOnboardingContext>
      initialContext={initialContextWithUser}
      steps={commonFlowSteps} // Your defined onboarding steps (replace commonFlowSteps)
      plugins={[supabasePlugin]} // Crucial: Add the plugin here
      componentRegistry={commonRegistry} // Your React component mapping for steps (replace commonRegistry)
    >
      {children}
    </OnboardingProvider>
  )
}
```

## 3. Using with @onboardjs/core (Headless)

If you're using the core `OnboardingEngine` directly (e.g., in a Node.js backend or a different frontend framework), you can install the plugin directly:

```tsx
import { OnboardingEngine, OnboardingContext } from '@onboardjs/core'
import { createSupabasePlugin } from '@onboardjs/supabase-plugin'
import { createClient, User } from '@supabase/supabase-js' // Your Supabase client setup

// Define your App's custom OnboardingContext
interface AppOnboardingContext extends OnboardingContext {
  currentUser?: User
  // ...
}

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const engine = new OnboardingEngine<AppOnboardingContext>({
  steps: [], // Your onboarding steps
  initialContext: {
    // You must provide `currentUser` here if not using `useSupabaseAuth: true`
    // OR ensure it gets updated into the context before persistence operations are called.
  },
  // You would typically not define loadData/persistData here if using the plugin
})

// Install the plugin after engine creation
engine.use(
  createSupabasePlugin<AppOnboardingContext>({
    client: supabaseClient,
    tableName: 'onboarding_progress',
    userIdColumn: 'user_id',
    stateDataColumn: 'flow_data',
    useSupabaseAuth: true,
  }),
)

// Don't forget to await engine.ready() before interacting with it
// await engine.ready();
```

## How the Plugin Handles User IDs

The plugin needs a way to identify _which user's_ onboarding state to load or persist. It offers two primary methods:

### Method 1: **useSupabaseAuth** (Recommended)

By setting `useSupabaseAuth: true`, the plugin will automatically:

1. On engine initialization, call `supabase.auth.getUser()` to retrieve the currently authenticated user.
2. Use that user's `id` for all database queries (`SELECT`, `UPSERT`, `UPDATE`).
3. Automatically set `context.currentUser = user` in your `OnboardingContext`, ensuring your application has access to the user object throughout the flow.

This is the most seamless way to integrate if your application relies on Supabase for authentication.

### Method 2: **contextKeyForId** (Manual)

If `useSupabaseAuth` is `false`, you must provide `contextKeyForId`. This tells the plugin which path in your `OnboardingContext` holds the user's unique ID.

**Example:**

1. If your `OnboardingContext` looks like `{ flowData: {}, userProfile: { userId: '123' } }`, you would set `contextKeyForId: 'userProfile.userId'`.
2. If your `OnboardingContext` looks like `{ flowData: {}, id: '123' }`, you would set `contextKeyForId: 'id'`.

**Important**: Ensure the value at `contextKeyForId` is a `string` and is present in your `initialContext` or is updated into the context before any persistence operations (like `next()`, `updateContext()`, `reset()`) trigger a save. If the ID is missing, persistence operations will be skipped.

## Database Schema Recommendation

For optimal use, your Supabase table should at least have:

- A `user_id` column (e.g., `UUID`) which links to `auth.users(id)` if using Supabase Auth.
- A `flow_data` column (e.g., `JSONB`) to store the entire `OnboardingContext` (excluding functions).

```sql
CREATE TABLE onboarding_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- For Next.js/Frontend access via Row Level Security (RLS)
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own onboarding progress"
  ON onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert/update their own onboarding progress"
  ON onboarding_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own onboarding progress"
  ON onboarding_progress FOR UPDATE USING (auth.uid() = user_id);
```

Why `JSONB` for `flow_data`? `JSONB` is PostgreSQL's optimized binary JSON type. It's efficient for storage and allows for indexing and querying within the JSON data if needed (though not directly used by this plugin for internal queries).

## Error Handling

The plugin includes an `onError` callback in its configuration. This is highly recommended for debugging and monitoring persistence issues:

```tsx
createSupabasePlugin({
  // ... config
  onError: (error, operation) => {
    console.error(
      `[Supabase Plugin] Failed to ${operation} onboarding state:`,
      error.message,
      error.details, // Supabase specific error details
    )
    // Integrate with Sentry, LogRocket, or your preferred error tracking system
  },
})
```

If `onError` is not provided, or if the error is re-thrown by your custom `onError` handler, the error will be propagated to the main `OnboardingEngine`'s global error handler.

## Best Practices with the Supabase Plugin

- **Secure Your Data**: Always implement Row Level Security (RLS) on your `onboarding_state` table to ensure users can only access their own data.
- **Keep Context Lean**: Only persist necessary data in your `OnboardingContext`. Avoid functions, large binary objects, or transient UI state.
- **Monitor Errors**: Pay attention to errors reported by the `onError` callback to quickly identify and fix persistence issues.
- **Clear Completed Flows**: Consider clearing a user's onboarding state from Supabase once their flow is `isCompleted` to keep your database clean. The plugin's `clearPersistedData` function can be triggered via `engine.reset()` or if you explicitly call it.

## Troubleshooting

- **"Persistence Not Working"**:
  - Is `userId` resolving? Ensure the plugin can correctly obtain the user ID, either via `useSupabaseAuth: true` (and a logged-in user) or correctly configured `contextKeyForId` with the ID present in context. Check console warnings.
  - Check Supabase RLS: Verify your RLS policies are not preventing `SELECT`, `INSERT`, or `UPDATE` operations. Test with a Supabase service role key (for debugging only) to rule out RLS issues.
  - Console Errors: Look for any errors logged by the `onError` callback or the main OnboardJS engine.
- **"Corrupted Data / Invalid State"**: If the data loaded from `flow_data` causes issues (e.g., due to schema changes), you might need to implement a data migration strategy on load, or clear the corrupted state for the user.

## Contributing

This plugin is open-source and contributions are welcome! If you have ideas for improvements, new features, or encounter any issues, please check the [plugin's GitHub repository](https://github.com/Somafet/onboardjs/tree/main/packages/plugins/supabase).

## Related Guides

- [Persistence in OnboardJS Core](https://onboardjs.com/docs/persistence)
- [The Onboarding Context](https://onboardjs.com/docs/onboarding-context)
- [OnboardingProvider (React)](https://onboardjs.com/docs/react/onboarding-provider)
