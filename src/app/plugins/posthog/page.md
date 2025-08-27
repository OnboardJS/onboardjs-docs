---
title: PostHog Analytics Plugin
nextjs:
  metadata:
    title: PostHog Analytics Plugin for OnboardJS
    description: Gain deep insights into user onboarding with the official OnboardJS PostHog plugin. Track progress, detect churn, and A/B test your flows.
---

{% link href="https://posthog.com" target="_blank" %}
  {% posthog-icon height="50px" width="auto" className="text-black dark:text-white" /%}
{% /link %}

The official **PostHog analytics plugin for OnboardJS**. This plugin automatically integrates your OnboardJS flows with PostHog, capturing critical user behavior events, enabling you to build detailed funnels, detect churn, and run powerful A/B tests.

---

## Why PostHog for Onboarding Analytics?

**Did you know** that without precise event tracking, you're essentially flying blind through your user onboarding? You won't know exactly where users drop off, what features they engage with first, or which flow variations convert best. This leads to missed opportunities and suboptimal user experiences.

PostHog is an open-source product analytics platform that offers powerful event tracking, funnels, user paths, and feature flags—making it an ideal partner for OnboardJS's flexible, headless architecture.

The OnboardJS PostHog plugin handles all the tedious event capturing and property enrichment, allowing you to focus on analyzing data and iterating on your onboarding strategy.

### Key Benefits

- **Automated Event Tracking:** Automatically sends detailed events like `step_active`, `step_completed`, `flow_completed`, and more.
- **Identify Drop-off Points:** Pinpoint exactly where users are abandoning your onboarding flows using funnels.
- **Detect Churn Risk:** Automated churn detection identifies users who are getting stuck or leaving your flow.
- **A/B Test Flows:** Leverage PostHog Experiments to run experiments and measure the impact of different onboarding variations.
- **Performance Insights:** Track step render times to optimize the speed and responsiveness of your onboarding.
- **Privacy-Centric:** Options for data sanitization and PII redaction.
- **Reduced Development Effort:** No need to manually instrument every button click or step view.

## Installation

First, install the plugin package and its peer dependencies:

```bash
npm install @onboardjs/core @onboardjs/plugin-posthog posthog-js
# or
yarn add @onboardjs/core @onboardjs/plugin-posthog posthog-js
# or
pnpm add @onboardjs/core @onboardjs/plugin-posthog posthog-js
```

## Setup & Usage

The PostHog Analytics Plugin integrates directly with your `OnboardingProvider` in `@onboardjs/react` or directly with the `OnboardingEngine` in `@onboardjs/core`.

Before you start:

1.  **PostHog Client**: Ensure you have `posthog-js` initialized in your application. This is typically done once at the root level of your client-side app.   
   
    ```typescript
    // Example: pages/_app.tsx or layout.tsx
    import posthog from 'posthog-js'

    if (typeof window !== 'undefined') {
      posthog.init('YOUR_POSTHOG_API_KEY', {
        api_host: 'https://app.posthog.com',
        // Optional: configure other posthog.init options
        capture_pageview: false // Recommend setting this to false if OnboardJS events cover your needs
      })
    }
    ```

**For Next.js**, follow the official [PostHog Next.js guide](https://posthog.com/docs/libraries/next-js) to ensure proper initialization.

## 1. Configure the Plugin

The plugin's configuration options allow you to tailor it to your PostHog setup, desired level of detail, and specific tracking needs.

```tsx
import { createPostHogPlugin } from '@onboardjs/plugin-posthog'
import posthog from 'posthog-js' // Your initialized PostHog instance

// Minimal configuration
const basicPostHogPlugin = createPostHogPlugin({
  posthogInstance: posthog, // Pass the initialized PostHog client
  debug: process.env.NODE_ENV === 'development', // See logs in console
})
```
This basic setup is enough to get started with automatic event tracking. However, you can customize it further to suit your needs.


```tsx
// Advanced configuration example
const advancedPostHogPlugin = createPostHogPlugin<YourAppContext>({
  posthogInstance: posthog,
  eventPrefix: 'saas_onboarding_', // All events will be prefixed (e.g., 'saas_onboarding_step_active')

  // Customize specific event names
  customEventNames: {
    flowCompleted: 'saas_onboarding_signup_success',
  },

  // Enrich all events with global properties
  globalProperties: {
    app_version: '1.5.0',
    onboarding_variant: 'v2',
  },

  // Add properties to specific step types
  stepPropertyEnrichers: {
    USER_PROFILE: (step, context) => ({
      profile_form_version: '2024-03-A',
      is_premium_tier_flow: context.flowData.selectedPlan === 'premium',
    }),
    INTEGRATION_CHOICE: (step, context) => ({
      integrations_shown_count: step.payload.options.length,
    }),
  },

  // Control what data is included in events
  includeUserProperties: true, // Default: true
  includeFlowData: true, // Default: true
  includeStepMetadata: true, // Default: true
  includeSessionData: true, // Includes session ID, page URL, user agent etc.
  includePerformanceMetrics: true, // Includes step render time, memory usage, navigation time

  // Privacy & Data Filtering
  excludePersonalData: true, // Automatically redacts common PII like email, name, password
  excludeFlowDataKeys: ['apiKey', 'sensitiveAuthToken'], // Exclude specific sensitive keys from flowData
  excludeEvents: ['persistenceSuccess', 'persistenceFailure'], // Exclude certain events from tracking

  // Churn Detection
  enableChurnDetection: true,
  churnTimeoutMs: 180000, // 3 minutes idle time before 'step_abandoned' is fired
  churnRiskThreshold: 0.75, // Threshold for 'high_churn_risk' event (0-1)

  // Progress Milestones
  enableProgressMilestones: true,
  milestonePercentages: [20, 50, 80], // Fire 'progress_milestone' at these percentages

  // A/B Testing Integration
  enableExperimentTracking: true,
  experimentFlags: ['onboarding-flow-a', 'onboarding-new-ux-test'], // Monitor these feature flags for experiments

  // Performance Thresholds for 'step_render_slow' event
  performanceThresholds: {
    slowRenderMs: 1000, // Fire 'step_render_slow' if a step takes >1s to render
  },

  // Debugging
  enableConsoleLogging: true, // Log events to console before sending
})
```

## 2. Add to Your OnboardingProvider (React)

Once configured, pass the `postHogPlugin` instance to the `plugins` array of your `OnboardingProvider`.

```tsx
// src/components/OnboardingProviderWrapper.tsx
'use client' // Important for Next.js App Router

import React, { useEffect } from 'react'
import { OnboardingProvider, OnboardingContext } from '@onboardjs/react'
import { createPostHogPlugin } from '@onboardjs/plugin-posthog'
import posthog from 'posthog-js' // Your initialized PostHog client

// Define your App's custom OnboardingContext if needed
interface AppOnboardingContext extends OnboardingContext {
  currentUser?: { id: string; email?: string; name?: string; plan?: string }
  // ... other application-specific context properties
}

// Example Onboarding Steps (replace with your actual steps)
const myOnboardingSteps = [
  { id: 'welcome', type: 'INFORMATION', payload: { mainText: 'Welcome!' }, nextStep: 'profile' },
  { id: 'profile', type: 'FORM', payload: { /* form config */ }, nextStep: 'integrations' },
  { id: 'integrations', type: 'CHECKLIST', payload: { /* checklist config */ }, nextStep: 'finish' },
  { id: 'finish', type: 'CONFIRMATION', payload: { mainText: 'You\'re all set!' }, nextStep: null },
];

export default function OnboardingProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Create the PostHog plugin instance
  const postHogPlugin = createPostHogPlugin<AppOnboardingContext>({
    posthogInstance: posthog,
    debug: process.env.NODE_ENV === 'development',
    enableChurnDetection: true,
    churnTimeoutMs: 60000, // 1 minute for quick testing
    enableProgressMilestones: true,
    milestonePercentages: [33, 66, 100],
  })

  useEffect(() => {
    // It's crucial to identify your user in PostHog once their ID is known.
    // This connects all captured events to that specific user.
    // Example: Fetch user ID from authentication state.
    const userId = 'user_abc_123'; // Replace with actual user ID
    if (userId) {
      posthog.identify(userId, {
        email: 'user@example.com',
        name: 'Jane Doe',
        plan: 'pro'
      });
    }
  }, []);

  return (
    <OnboardingProvider<AppOnboardingContext>
      steps={myOnboardingSteps}
      plugins={[postHogPlugin]} // Add the plugin here!
      // optional: initialContext={{ currentUser: { id: 'user_abc_123' }}}
    >
      {children}
    </OnboardingProvider>
  )
}
```

## 3. Using with @onboardjs/core (Headless)

If you're using the core `OnboardingEngine` directly (e.g., in a Node.js backend, a different frontend framework, or for server-side initialization), you can install the plugin directly:

```tsx
import { OnboardingEngine, OnboardingContext } from '@onboardjs/core'
import { createPostHogPlugin } from '@onboardjs/plugin-posthog'
import posthog from 'posthog-js' // Your initialized PostHog client

// Initialize PostHog if it hasn't been already (e.g., in a script tag or global init)
if (typeof window !== 'undefined' && !posthog.__loaded) {
  posthog.init('YOUR_POSTHOG_API_KEY', { api_host: 'https://app.posthog.com' });
}

// Define your App's custom OnboardingContext
interface AppOnboardingContext extends OnboardingContext {
  currentUser?: { id: string; email?: string; name?: string; plan?: string }
  // ...
}

const engine = new OnboardingEngine<AppOnboardingContext>({
  steps: [], // Your onboarding steps
  initialContext: {
    currentUser: { id: 'headless-user-456' }, // Provide initial user context
  },
})

// Install the plugin after engine creation
// Ensure `posthog` is initialized before calling createPostHogPlugin
engine.use(
  createPostHogPlugin<AppOnboardingContext>({
    posthogInstance: posthog,
    debug: true,
    enableChurnDetection: true,
  }),
)

// Don't forget to await engine.ready() before interacting with it
// await engine.ready();
```

## 📊 Automatic Events Captured

The plugin automatically captures a rich set of events to give you a detailed view of your onboarding performance. You can use these to build funnels and insights in PostHog.

| Event Name (Default)        | Trigger                                                                                                | Key Properties Included                                                                                                                                                                                                   |
| :-------------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onboarding_flow_started`   | The OnboardJS engine is initialized and a flow begins.                                                 | `start_method` (`'fresh'` or `'resumed'`), `total_steps`, `flow_start_time_ms`, `initial_flow_data_size`                                                                                                                |
| `onboarding_step_active`    | A new step becomes the `currentStep` in the engine.                                                    | `step_id`, `step_type`, `step_index`, `is_first_step`, `is_last_step`, `flow_progress_percentage`, `previous_step_id`                                                                                                      |
| `onboarding_step_completed` | The user successfully completes a step (e.g., calls `engine.next()`).                                | `step_id`, `step_type`, `step_data` (sanitized), `flow_progress_percentage`, `render_time_ms`, `completion_method`                                                                                                    |
| `onboarding_step_abandoned` | User is idle on a step for `churnTimeoutMs` (if `enableChurnDetection: true`).                       | `step_id`, `step_type`, `churn_risk_score`, `is_high_risk`, `time_on_step_ms`, `back_navigation_count`, `error_count`, `idle_time_ms`, `validation_failures`                                                              |
| `onboarding_high_churn_risk`| A user reaches a calculated `churn_risk_score` above `churnRiskThreshold`.                            | `step_id`, `churn_risk_score`, `primary_risk_factor` (`timeOnStep`, `errors`, `backNavigation`, `idle`, `validationFailures`)                                                                                            |
| `onboarding_progress_milestone` | User reaches a configured `milestonePercentages` (e.g., 25%, 50%).                                   | `milestone_percentage`, `actual_progress`, `steps_completed`                                                                                                                                                            |
| `onboarding_navigation_back`| User navigates to a previous step (e.g., calls `engine.previous()`).                                 | `from_step_id`, `to_step_id`, `from_step_type`, `to_step_type`                                                                                                                                                          |
| `onboarding_navigation_forward`| User navigates to a subsequent step via `next()` (excluding skips/jumps).                         | `from_step_id`, `to_step_id`, `from_step_type`, `to_step_type`                                                                                                                                                          |
| `onboarding_navigation_jump`| User navigates non-sequentially (e.g., `engine.goToStep()`, or `skipToStep` if not `nextStep`).      | `from_step_id`, `to_step_id`, `from_step_type`, `to_step_type`                                                                                                                                                          |
| `onboarding_error_encountered`| An error occurs within the OnboardJS engine.                                                           | `error_message`, `error_stack`, `error_name`, `current_step_id`                                                                                                                                                         |
| `onboarding_experiment_exposed`| User is exposed to a variant of a `experimentFlags` feature flag.                                    | `experiment_flag`, `variant`, `user_id`                                                                                                                                                                                 |
| `onboarding_checklistItem_toggled`| A checklist item's completion status is changed.                                                  | `item_id`, `is_completed`, `step_id`, `step_type`                                                                                                                                                                       |
| `onboarding_checklist_progress`| The progress of a checklist step changes.                                                           | `completed`, `total`, `percentage`, `is_complete`, `step_id`                                                                                                                                                            |
| `onboarding_flow_paused`    | The flow enters a paused state (requires explicit engine support for pausing).                         | `reason`                                                                                                                                                                                                                |
| `onboarding_flow_resumed`   | The flow resumes from a paused state.                                                                  | `resume_point`                                                                                                                                                                                                          |
| `onboarding_flow_abandoned` | The flow is officially marked as abandoned (e.g., via a specific engine call).                       | `abandonment_reason`                                                                                                                                                                                                    |
| `onboarding_flow_reset`     | The onboarding flow is reset.                                                                          | `reset_reason`                                                                                                                                                                                                          |
| `onboarding_step_skipped`   | User skips a step.                                                                                     | `step_id`, `skip_reason`                                                                                                                                                                                                |
| `onboarding_step_retried`   | User re-attempts a step (requires explicit engine support for retries).                                | `step_id`, `retry_count`                                                                                                                                                                                                |
| `onboarding_step_validation_failed`| A step's validation logic fails.                                                              | `step_id`, `validation_errors`                                                                                                                                                                                          |
| `onboarding_step_help_requested`| User requests help on a step (requires custom handling to emit this event).                       | `step_id`, `help_type`                                                                                                                                                                                                  |
| `onboarding_data_changed`   | Data within `context.flowData` changes. (Excluded by default due to high volume; enable with caution). | `changed_keys`, `data_size_before`, `data_size_after`                                                                                                                                                                   |
| `onboarding_step_render_slow`| A step takes longer than `performanceThresholds.slowRenderMs` to render.                            | `step_id`, `render_time_ms`, `threshold_ms`                                                                                                                                                                             |
| `onboarding_persistence_success`| Onboarding state is successfully persisted by a `DataPersistFn`. (Excluded by default).          | `persistence_time_ms`                                                                                                                                                                                                   |
| `onboarding_persistence_failure`| Onboarding state persistence fails.                                       | `error_message`                                                                                                                                                                                                         |
| `onboarding_checklist_item_toggled`| A checklist item's `isCompleted` status changes.                                               | `item_id`, `is_completed`, `step_id`, `step_type`                                                                                                                                                                       |
| `onboarding_plugin_error`   | An error occurs within this or another plugin.                                                         | `plugin_name`, `error_message`, `failed_event` (if related to event capture)                                                                                                                                            |

**Note on Property Inclusion:** All events automatically include relevant context properties (like `user_properties`, `flow_data`, `step_metadata`, `session_data`, `performance_metrics`) based on your plugin configuration.

## 🛡️ Privacy & Data Handling

The plugin prioritizes privacy by offering robust configuration options:

*   **`excludePersonalData: true`**: Automatically redacts common PII (e.g., `email`, `name`, `password`, `token`, `api_key`, `secret`) from all event properties.
*   **`excludeFlowDataKeys: ['key1', 'key2']`**: Explicitly specify any sensitive keys within your `flowData` that should *never* be sent to PostHog.
*   **`sanitizeData: (data) => { /* custom logic */ }`**: Provides a powerful escape hatch for implementing custom data sanitization before any event is sent to PostHog.

Always ensure your data collection practices comply with relevant privacy regulations (e.g., GDPR, CCPA).

## ⚠️ Troubleshooting

*   **"Events Not Appearing in PostHog"**:
    *   **PostHog Initialization:** Double-check that `posthog.init()` is called correctly and only once in your client-side application.
    *   **API Key & Host:** Verify `apiKey` and `host` in your plugin configuration are correct.
    *   **`debug: true`:** Enable `debug: true` in the plugin config to see verbose logs in your browser console (`[PostHogPlugin] Event captured...`).
    *   **Filtering:** Check `excludeEvents` or `includeOnlyEvents` in your plugin configuration—you might be unintentionally filtering out events.
    *   **Network Tab:** Open your browser's network tab and look for requests to your PostHog host. **It might be that events are being blocked by your bowser's or network's ad blocker.**
*   **"Dashboard Insights Not Showing Data"**:
    *   **Correct Event Names:** If you used `customEventNames`, ensure the event names in the dashboard insights match your custom names.
    *   **Feature Flag/Event Placeholders:** For the Experiment Dashboard, remember to replace `YOUR_EXPERIMENT_FLAG_NAME` placeholders with your actual feature flag key. Similarly, update the retention event name.
    *   **Time Range:** Adjust the date range filter on your PostHog dashboard to ensure it covers when you've been generating events.

## 🤝 Contributing

This plugin is open-source and contributions are welcome! If you have ideas for improvements, new features, or encounter any issues, please check the [plugin's GitHub repository](https://github.com/Somafet/onboardjs/tree/main/packages/plugins/posthog).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Somafet/onboardjs/blob/main/LICENSE.md) file for details.
