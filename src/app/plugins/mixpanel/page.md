---
title: Mixpanel Analytics Plugin
nextjs:
  metadata:
    title: Mixpanel Analytics Plugin for OnboardJS
    description: Gain deep insights into user onboarding with the official OnboardJS Mixpanel plugin. Track progress, detect churn, and optimize your flows.
---

{% link href="https://mixpanel.com" target="_blank" %}
{% mixpanel-icon height="50px" width="auto" className="text-black dark:text-white" /%}
{% /link %}

The official **Mixpanel analytics plugin for OnboardJS**. This plugin seamlessly integrates your OnboardJS flows with Mixpanel, capturing detailed user behavior events, enabling you to build comprehensive funnels, detect churn risks, and optimize your onboarding experience.

---

## Why Mixpanel for Onboarding Analytics?

**Did you know** that without precise event tracking, you're essentially flying blind through your user onboarding? You won't know exactly where users drop off, what features they engage with first, or which flow variations convert best. This leads to missed opportunities and suboptimal user experiences.

Mixpanel is a powerful product analytics platform that specializes in event-based tracking, user behavior analysis, and conversion optimization—making it an ideal partner for OnboardJS's flexible, headless architecture.

The OnboardJS Mixpanel plugin handles all the complex event capturing and property enrichment, allowing you to focus on analyzing data and iterating on your onboarding strategy.

### Key Benefits

- **Automated Event Tracking:** Automatically sends detailed events like `step_active`, `step_completed`, `flow_completed`, and more.
- **Identify Drop-off Points:** Pinpoint exactly where users are abandoning your onboarding flows using Mixpanel's funnel analysis.
- **Detect Churn Risk:** Automated churn detection identifies users who are getting stuck or leaving your flow.
- **A/B Test Flows:** Leverage Mixpanel Experiments to run tests and measure the impact of different onboarding variations.
- **Performance Insights:** Track step render times to optimize the speed and responsiveness of your onboarding.
- **Privacy-Centric:** Options for data sanitization and PII redaction.
- **Reduced Development Effort:** No need to manually instrument every button click or step view.

## Installation

First, install the plugin package and its peer dependencies:

```bash
npm install @onboardjs/core @onboardjs/mixpanel-plugin mixpanel-browser
# or
yarn add @onboardjs/core @onboardjs/mixpanel-plugin mixpanel-browser
# or
pnpm add @onboardjs/core @onboardjs/mixpanel-plugin mixpanel-browser
```

## Setup & Usage

The Mixpanel Analytics Plugin integrates directly with your `OnboardingProvider` in `@onboardjs/react` or directly with the `OnboardingEngine` in `@onboardjs/core`.

**Before you start:**

**For Next.js**, follow the official [Mixpanel Next.js integrations guide](https://docs.mixpanel.com/docs/tracking-methods/integrations/nextjs) to ensure proper initialization.

## 1. Configure the Plugin

The plugin's configuration options allow you to tailor it to your Mixpanel setup, desired level of detail, and specific tracking needs.

There are two ways to initialize Mixpanel for the OnboardJS Mixpanel Plugin:

1.  **Mixpanel Client**: You can pass your Mixpanel setup in two ways for the OnboardJS Mixpanel Plugin. - Directly initialize Mixpanel in your app:

          ```typescript
          import { createMixpanelPlugin } from '@onboardjs/mixpanel-plugin'
          import mixpanel from 'mixpanel-browser' // Your initialized Mixpanel instance

          // Minimal configuration
          const basicMixpanelPlugin = createMixpanelPlugin({
            mixpanelInstance: mixpanel, // Pass the initialized Mixpanel client
            debug: process.env.NODE_ENV === 'development', // See logs in console
          })
          ```
        - Pass your Mixpanel token
          ```typescript
          import { createMixpanelPlugin } from '@onboardjs/mixpanel-plugin'

          // Minimal configuration
          const basicMixpanelPlugin = createMixpanelPlugin({
            token: process.env.PUBLIC_MIXPANEL_TOKEN,
            debug: process.env.NODE_ENV === 'development', // See logs in console
          })
          ```

    This basic setup is enough to get started with automatic event tracking. However, you can customize it further to suit your needs.

```tsx
// Advanced configuration example
const advancedMixpanelPlugin = createMixpanelPlugin<YourAppContext>({
  mixpanelInstance: mixpanel,
  eventPrefix: 'saas_onboarding_', // All events will be prefixed (e.g., 'saas_onboarding_step_active')

  // Customize specific event names
  customEventNames: {
    flowCompleted: 'saas_onboarding_signup_success',
    stepCompleted: 'onboarding_step_finished',
  },

  // Enrich all events with global properties
  globalProperties: {
    app_version: '1.5.0',
    onboarding_variant: 'v2',
    platform: 'web',
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

  // User property mapping
  userPropertyMapper: (user) => ({
    $email: user.email,
    $name: user.name,
    signup_date: user.createdAt,
    plan: user.subscription?.plan,
  }),

  // Debugging
  enableConsoleLogging: true, // Log events to console before sending
})
```

## 2. Add to Your OnboardingProvider (React)

Once configured, pass the `mixpanelPlugin` instance to the `plugins` array of your `OnboardingProvider`.

```tsx
// src/components/OnboardingProviderWrapper.tsx
'use client' // Important for Next.js App Router

import React, { useEffect } from 'react'
import { OnboardingProvider, OnboardingContext } from '@onboardjs/react'
import { createMixpanelPlugin } from '@onboardjs/mixpanel-plugin'

export default function OnboardingProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Create the Mixpanel plugin instance
  const mixpanelPlugin = createMixpanelPlugin({
    token: process.env.PUBLIC_MIXPANEL_TOKEN,
  })

  return (
    <OnboardingProvider
      steps={myOnboardingSteps}
      plugins={[mixpanelPlugin]} // Add the plugin here!
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
import { OnboardingEngine } from '@onboardjs/core'
import { createMixpanelPlugin } from '@onboardjs/mixpanel-plugin'
import mixpanel from 'mixpanel-browser' // Your initialized Mixpanel client

// Initialize Mixpanel if it hasn't been already (e.g., in a script tag or global init)
if (typeof window !== 'undefined' && !mixpanel.config) {
  mixpanel.init('YOUR_MIXPANEL_TOKEN', { debug: true })
}

const engine = new OnboardingEngine({
  steps: [], // Your onboarding steps
  initialContext: {
    currentUser: { id: 'headless-user-456' }, // Provide initial user context
  },
})

// Install the plugin after engine creation
// Ensure `mixpanel` is initialized before calling createMixpanelPlugin
engine.use(
  createMixpanelPlugin({
    token: process.env.PUBLIC_MIXPANEL_TOKEN,
  }),
)

// Don't forget to await engine.ready() before interacting with it
// await engine.ready();
```

## 📊 Automatic Events Captured

The plugin automatically captures a rich set of events to give you a detailed view of your onboarding performance. You can use these to build funnels and insights in Mixpanel.

| Event Name (Default)     | Trigger                                                                                                | Key Properties Included                                                                                                                          |
| :----------------------- | :----------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `flow_started`           | The OnboardJS engine is initialized and a flow begins.                                                 | `start_method` (`'fresh'` or `'resumed'`), `total_steps`, `flow_start_time_ms`, `initial_flow_data_size`                                         |
| `step_active`            | A new step becomes the `currentStep` in the engine.                                                    | `step_id`, `step_type`, `step_index`, `is_first_step`, `is_last_step`, `flow_progress_percentage`, `previous_step_id`                            |
| `step_completed`         | The user successfully completes a step (e.g., calls `engine.next()`).                                  | `step_id`, `step_type`, `step_data` (sanitized), `flow_progress_percentage`, `render_time_ms`, `completion_method`                               |
| `step_abandoned`         | User is idle on a step for `churnTimeoutMs` (if `enableChurnDetection: true`).                         | `step_id`, `step_type`, `time_on_step_ms`                                                                                                        |
| `high_churn_risk`        | A user reaches a calculated churn risk score above `churnRiskThreshold`.                               | `step_id`, `risk_score`, `time_on_step_ms`, `back_navigation_count`, `error_count`, `idle_time_ms`, `validation_failures`, `primary_risk_factor` |
| `progress_milestone`     | User reaches a configured `milestonePercentages` (e.g., 25%, 50%).                                     | `milestone_percentage`, `actual_progress`, `steps_completed`                                                                                     |
| `navigation_back`        | User navigates to a previous step (e.g., calls `engine.previous()`).                                   | `from_step_id`, `to_step_id`, `navigation_type`                                                                                                  |
| `navigation_forward`     | User navigates to a subsequent step via `next()` (excluding skips/jumps).                              | `from_step_id`, `to_step_id`, `navigation_type`                                                                                                  |
| `navigation_jump`        | User navigates non-sequentially (e.g., `engine.goToStep()`, or `skipToStep` if not `nextStep`).        | `from_step_id`, `to_step_id`, `jump_distance`                                                                                                    |
| `error_encountered`      | An error occurs within the OnboardJS engine.                                                           | `error_message`, `error_stack`, `error_type`                                                                                                     |
| `experiment_exposed`     | User is exposed to a variant of a `experimentFlags` feature flag.                                      | `experiment_flag`, `variant`, `user_id`                                                                                                          |
| `checklist_item_toggled` | A checklist item's completion status is changed.                                                       | `item_id`, `checked`, `step_id`                                                                                                                  |
| `checklist_progress`     | The progress of a checklist step changes.                                                              | `completed_items`, `total_items`, `completion_percentage`, `step_id`                                                                             |
| `flow_paused`            | The flow enters a paused state (requires explicit engine support for pausing).                         | `reason`                                                                                                                                         |
| `flow_resumed`           | The flow resumes from a paused state.                                                                  | `resume_point`                                                                                                                                   |
| `flow_abandoned`         | The flow is officially marked as abandoned (e.g., via a specific engine call).                         | `abandonment_reason`                                                                                                                             |
| `flow_reset`             | The onboarding flow is reset.                                                                          | `reset_reason`                                                                                                                                   |
| `flow_completed`         | The entire onboarding flow is completed successfully.                                                  | `completion_time_ms`, `total_steps`, `completed_steps`, `skipped_steps`, `retried_steps`, `flow_completion_time_ms`                              |
| `step_skipped`           | User skips a step.                                                                                     | `step_id`, `skip_reason`                                                                                                                         |
| `step_retried`           | User re-attempts a step (requires explicit engine support for retries).                                | `step_id`, `retry_count`                                                                                                                         |
| `step_validation_failed` | A step's validation logic fails.                                                                       | `step_id`, `validation_errors`, `error_count`                                                                                                    |
| `step_help_requested`    | User requests help on a step (requires custom handling to emit this event).                            | `step_id`, `help_type`                                                                                                                           |
| `data_changed`           | Data within `context.flowData` changes. (Excluded by default due to high volume; enable with caution). | `changed_keys`, `change_count`                                                                                                                   |
| `step_render_slow`       | A step takes longer than `performanceThresholds.slowRenderMs` to render.                               | `step_id`, `render_time_ms`, `threshold_ms`, `performance_ratio`                                                                                 |
| `persistence_success`    | Onboarding state is successfully persisted by a `DataPersistFn`. (Excluded by default).                | `persistence_time_ms`                                                                                                                            |
| `persistence_failure`    | Onboarding state persistence fails.                                                                    | `error_message`, `error_type`                                                                                                                    |
| `user_idle`              | User becomes idle during the onboarding process.                                                       | `idle_time_ms`                                                                                                                                   |
| `user_returned`          | User returns after being idle.                                                                         | `away_time_ms`                                                                                                                                   |
| `plugin_error`           | An error occurs within this or another plugin.                                                         | `plugin_name`, `error_message`, `error_type`, `error_stack`                                                                                      |

**Note on Property Inclusion:** All events automatically include relevant context properties (like `user_properties`, `flow_data`, `step_metadata`, `session_data`, `performance_metrics`) based on your plugin configuration.

## Configuration Presets

The plugin comes with pre-configured setups for common use cases:

### SaaS Applications

```typescript
import { saasConfig, createMixpanelPlugin } from '@onboardjs/mixpanel-plugin'

const mixpanelPlugin = createMixpanelPlugin({
  ...saasConfig,
  mixpanelInstance: mixpanel,
  token: 'your-token', // if not using mixpanelInstance
})
```

### E-commerce

```typescript
import {
  ecommerceConfig,
  createMixpanelPlugin,
} from '@onboardjs/mixpanel-plugin'

const mixpanelPlugin = createMixpanelPlugin({
  ...ecommerceConfig,
  mixpanelInstance: mixpanel,
  token: 'your-token', // if not using mixpanelInstance
})
```

## 🛡️ Privacy & Data Handling

The plugin prioritizes privacy by offering robust configuration options:

- **`excludePersonalData: true`**: Automatically redacts common PII (e.g., `email`, `name`, `password`, `token`, `apiKey`, `secret`) from all event properties.
- **`excludeFlowDataKeys: ['key1', 'key2']`**: Explicitly specify any sensitive keys within your `flowData` that should _never_ be sent to Mixpanel.
- **`sanitizeData: (data) => { /* custom logic */ }`**: Provides a powerful escape hatch for implementing custom data sanitization before any event is sent to Mixpanel.

Always ensure your data collection practices comply with relevant privacy regulations (e.g., GDPR, CCPA).

## ⚠️ Troubleshooting

- **"Events Not Appearing in Mixpanel"**:
  - **Mixpanel Initialization:** Double-check that `mixpanel.init()` is called correctly and only once in your client-side application.
  - **Token:** Verify your Mixpanel project token is correct in your plugin configuration.
  - **`debug: true`:** Enable `debug: true` in the plugin config to see verbose logs in your browser console (`[MixpanelPlugin] Event captured...`).
  - **Filtering:** Check `excludeEvents` or `includeOnlyEvents` in your plugin configuration—you might be unintentionally filtering out events.
  - **Network Tab:** Open your browser's network tab and look for requests to Mixpanel endpoints (api.mixpanel.com). **It might be that events are being blocked by your browser's or network's ad blocker.**
- **"Dashboard Insights Not Showing Data"**:
  - **Correct Event Names:** If you used `customEventNames`, ensure the event names in the dashboard insights match your custom names.
  - **Feature Flag/Event Placeholders:** For experiments, remember to replace placeholder feature flag names with your actual feature flag keys.
  - **Time Range:** Adjust the date range filter on your Mixpanel dashboard to ensure it covers when you've been generating events.
- **"Plugin Not Loading"**:
  - **Mixpanel Instance:** Ensure you're passing either a valid `mixpanelInstance` or a `token` to initialize Mixpanel.
  - **Browser Environment:** The plugin is designed for browser environments. Server-side rendering might require additional configuration.

## 🤝 Contributing

This plugin is open-source and contributions are welcome! If you have ideas for improvements, new features, or encounter any issues, please check the [plugin's GitHub repository](https://github.com/Somafet/onboardjs/tree/main/packages/plugins/mixpanel).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Somafet/onboardjs/blob/main/LICENSE.md) file for details.
