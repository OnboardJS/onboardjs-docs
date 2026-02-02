# OnboardJS Documentation Audit Report

**Date:** February 2, 2026  
**Audit Scope:** @onboardjs/core@1.0.0-rc.3 and @onboardjs/react@1.0.0-rc.3  
**Target:** Documentation located in `src/app/` directory

---

## Executive Summary

This audit compares the documentation in the onboardjs-docs repository against the actual APIs exported from the installed packages. The analysis reveals **several missing APIs, incomplete documentation, and some inconsistencies** that should be addressed before RC release.

**Key Findings:**

- ✅ Core concepts are well documented
- ⚠️ Several advanced APIs are missing from documentation
- ❌ Some important methods are not mentioned in guides
- 🔄 Some examples use outdated patterns
- 📋 Analytics APIs are under-documented

---

## 1. Documented APIs (What the Docs Mention)

### @onboardjs/react Documentation

#### Core Exports (Mentioned)

- `OnboardingProvider` - Context provider for onboarding engine
- `useOnboarding()` - Hook for accessing engine state and actions
- `useOnboardingAnalytics()` - Hook for analytics tracking
- `OnboardingErrorBoundary` - Error handling component
- `OnboardingContainer` - Container component
- `PersistenceStatus` - Component for showing persistence state

#### Main Features Documented

- React bindings to core engine
- Context and hooks API
- Persistence (localStorage, custom backends)
- Event handling
- Plugin system (Supabase, Posthog, Mixpanel)
- Component registry for rendering steps

### @onboardjs/core Documentation

#### Core Exports (Mentioned)

- `OnboardingEngine` - Core engine for managing onboarding flows
- `ConfigurationBuilder` - Builder for engine configuration
- `StepValidator` - Validator for steps
- `OnboardingEngineConfig` - Configuration interface
- `OnboardingStep` - Step type definition

#### Features Documented

- Step definition (types, payloads)
- Dynamic navigation with functions
- Conditional steps
- Event system with event listeners
- Persistence with loadData/persistData
- Custom context handling

---

## 2. Actual APIs (What's Exported from Packages)

### @onboardjs/core Exports

#### Engine & Management

✅ `OnboardingEngine` - Main engine class
✅ `OnboardingEngineRegistry` - Registry for managing multiple engines
✅ `ConfigurationBuilder` - Configuration building utilities
✅ `StepValidator` - Step validation and error detection
✅ `EventManager` - Event management system
✅ `StateManager` - State management (deprecated in docs)
✅ `ChecklistManager` - Checklist progress tracking
✅ `ErrorHandler` - Error handling and history
✅ `PersistenceManager` - Persistence handling
✅ `NavigationManager` - Navigation control
✅ `EventHandlerRegistry` - Event handler registry

#### Analytics

✅ `AnalyticsManager` - Manager for analytics events
✅ `AnalyticsCoordinator` - Coordinator for multiple analytics providers
✅ `SessionTracker` - Session tracking
✅ `PerformanceTracker` - Performance metrics tracking
✅ `ActivityTracker` - Activity tracking
✅ `ProgressMilestoneTracker` - Progress milestone tracking
✅ `AhaTracker` - Aha moment tracking (mentioned in types but not in docs)

#### Utilities

✅ `StepUtils` - Step utility functions
✅ `FlowUtils` - Flow utility functions
✅ `AsyncOperationQueue` - Operation queuing service
✅ `Result` type - Result monad pattern (map, mapErr, andThen, safeSync, safeAsync, fromPromise)

#### Types & Plugins

✅ `BasePlugin` - Base class for plugins
✅ `PluginManager` - Plugin management
✅ Various payload types (MULTIPLE_CHOICE, SINGLE_CHOICE, CONFIRMATION, etc.)

### @onboardjs/react Exports

#### Hooks

✅ `useOnboarding()` - Main hook for accessing onboarding state and actions
✅ `useOnboardingAnalytics()` - Analytics hook
✅ `useSuspenseEngine()` - Internal hook for suspense support (exported!)

#### Components

✅ `OnboardingProvider` - Provider component
✅ `OnboardingErrorBoundary` - Error boundary
✅ `OnboardingContainer` - Container component
✅ `PersistenceStatus` - Persistence status component

#### Plugins

✅ `ReactPlugin` - Base class for React plugins
✅ Custom React plugin hooks (onReactMount, onReactUnmount)

#### Utilities

✅ `createStepsHash`, `createConfigHash`, `areStepsEqual` - Step/config comparison
✅ `getLoadingReason`, `createLoadingState` - Loading state utilities

---

## 3. Missing Documentation (Exported but Not Documented)

### Critical Missing APIs

#### 1. **OnboardingEngineRegistry** ❌

- **Type:** Class
- **Status:** Exported but not documented
- **Importance:** HIGH
- **Description:** Allows managing multiple onboarding engine instances with flow identification
- **Methods include:**
  - Register/unregister engines
  - Query engines by flow ID
  - Version compatibility checking
  - Flow metadata storage
- **Location:** `@onboardjs/core`
- **Impact:** Users building multi-flow applications won't know this exists

#### 2. **Analytics APIs** ❌

- **Exported:** AnalyticsManager, AnalyticsCoordinator, SessionTracker, PerformanceTracker, ActivityTracker, ProgressMilestoneTracker, AhaTracker
- **Status:** Mentioned in types but not in guides
- **Impact:** Limited guidance on how to use these trackers
- **Key Missing Details:**
  - How to register custom analytics providers
  - How to track performance metrics
  - How to track sessions and activity
  - How to track aha moments

#### 3. **Engine Methods Not Documented** ❌

- `engine.getFlowInfo()` - Get flow identification info
- `engine.getFlowId()`, `engine.getFlowVersion()`, `engine.getFlowName()`
- `engine.getFlowMetadata()` - Retrieve flow metadata
- `engine.generatePersistenceKey()` - Generate namespaced persistence keys
- `engine.matchesFlow(flowId)` - Check if engine matches flow
- `engine.isVersionCompatible(version)` - Semantic version checking
- `engine.getPerformanceStats()` - Get performance statistics
- `engine.getErrorHistory()` - Get error tracking history
- `engine.reportError(error, operation)` - Report errors to handler
- `engine.reportStepValidationFailure()` - Report validation failures
- `engine.reportHelpRequest()` - Report help requests
- `engine.pauseFlow(reason)` - Pause onboarding
- `engine.resumeFlow(resumePoint)` - Resume onboarding
- `engine.abandonFlow(reason)` - Mark flow as abandoned
- `engine.abandonStep(timeOnStep)` - Mark step as abandoned
- `engine.retryStep(retryCount)` - Mark step as retried
- `engine.trackEvent()` - Track custom events
- `engine.trackCustomEvent(name, properties, options)` - Track custom events with options
- `engine.registerAnalyticsProvider()` - Register analytics providers
- `engine.flushAnalytics()` - Flush pending analytics
- `engine.setAnalyticsUserId()` - Set user ID for analytics
- `engine.getDebugInfo()` - Get debugging information
- `engine.destroy()` - Cleanup and destroy engine
- `engine.clearCaches()` - Force cache garbage collection

#### 4. **Configuration Options Not Documented** ❌

The `OnboardingEngineConfig` has many options not mentioned in the Onboarding Config docs:

- `publicKey` - API public key
- `apiHost` - Custom API host
- `cloudOptions` - Cloud platform options
- `userId` - User identifier for analytics
- `analytics` - Analytics configuration object
  - `enabled` - Enable/disable analytics
  - `before_send` - Hook for filtering/modifying events
- `debug` - Debug mode flag
- `registry` - Engine registry instance
- `flowId`, `flowName`, `flowVersion`, `flowMetadata` - Flow identification

#### 5. **Loading State API** ❌

- **Type:** `LoadingState` type
- **Status:** Exported but not documented
- **Details:** Docs mention `isLoading` boolean but not the granular loading states:
  - `isHydrating` - Hydrating from persistence
  - `isEngineProcessing` - Engine is processing navigation
  - `isComponentProcessing` - Component is processing input
  - `isAnyLoading` - Any loading occurring
- **Impact:** Users can't take advantage of granular loading indicators

#### 6. **useOnboarding Hook Return Values** ⚠️

**Partially Documented:**

- ✅ Documented: `state`, `next`, `previous`, `skip`, `goToStep`, `updateContext`, `reset`, `renderStep`, `isLoading`, `currentStep`, `isCompleted`
- ❌ Not Documented:
  - `engine` - Direct access to engine instance
  - `loading` - Granular loading state object (NEW)
  - `setComponentLoading()` - Set component loading flag
  - `error` - Current error state

#### 7. **Result Type (Error Handling)** ❌

- **Type:** Exported monad-like Result type
- **Methods:** `map`, `mapErr`, `andThen`, `safeSync`, `safeAsync`, `fromPromise`
- **Status:** Exported but not documented
- **Impact:** Error handling patterns not explained

#### 8. **Checklist Support** ⚠️

- **Status:** ChecklistManager and ChecklistStepPayload exported
- **Issue:** Checklist steps mentioned in type definitions but not in documentation
- **Step Type:** `CHECKLIST` with `ChecklistStepPayload`
- **Missing:** Guide on how to use checklist steps

#### 9. **Step Validation Methods** ⚠️

- **Status:** StepValidator exported but usage not documented
- **Available Methods:**
  - `validateSteps()` - Full validation
  - `isValid()` - Quick check
  - `getErrors()` - Only errors
  - `getWarnings()` - Only warnings
- **Missing:** Guide on validation patterns

#### 10. **useSuspenseEngine Hook** ❌

- **Type:** Hook (internal, but exported)
- **Status:** Exported but completely undocumented
- **Purpose:** Provides suspense support for engine
- **Return:** `UseSuspenseEngineResult`

#### 11. **useOnboardingAnalytics Hook Details** ⚠️

- **Status:** Documented but incomplete
- **Returned:**
  - ✅ `trackAha()` - Documented
  - ✅ `aha` - Export documented (via type)
- **Missing:** Examples of all aha types and detailed analytics usage

#### 12. **Event System Details** ⚠️

- **Documented events:** `stateChange`, `beforeStepChange`, `stepChange`, `flowComplete`, `stepActive`, `stepComplete`, `contextUpdate`, `error`
- **Missing Events:**
  - `flowPaused` - Flow paused event
  - `flowResumed` - Flow resumed event
  - `flowAbandoned` - Flow abandoned event
  - `stepAbandoned` - Step abandoned event
  - `stepRetried` - Step retried event
  - `flowRegistered` - Flow registered event
  - `flowUnregistered` - Flow unregistered event

#### 13. **React Plugin Hooks** ❌

- **Type:** `ReactPluginHooks` interface
- **New Hooks:**
  - `onReactMount()` - Called when React tree mounts
  - `onReactUnmount()` - Called when React tree unmounts
- **Status:** Exported but not documented
- **Impact:** Plugin developers won't know about React-specific hooks

#### 14. **Component Registry as Step Property** ⚠️

- **Status:** OnboardingProvider prop `componentRegistry` mentioned
- **Missing:** Documentation that steps can now have a `component` property
- **Detail:** Props mention "will be overridden by `OnboardingStep.component` if defined"
- **Impact:** Users may not know about inline component definition

#### 15. **Advanced useOnboarding Options** ⚠️

- **Status:** Hook accepts `UseOnboardingOptions` but not fully documented
- **Options not in docs:**
  - `onFlowCompleted` - Callback for flow completion
  - `onStepChange` - Callback for step changes
  - `onBeforeStepChange` - Callback before step change
  - `loadData` - Data loading function
  - `persistData` - Data persistence function

---

## 4. Outdated Documentation

### 1. **useOnboarding Hook Documentation** ⚠️

**Issue:** Table describes properties that may be outdated

- Lists `currentStep`, `isCompleted` directly but these are part of `state` in actual hook
- Suggests `renderStepContent` function that doesn't appear in types
- The actual hook uses `renderStep()` (exists)
- Missing `loading` object documentation

**Example from docs:**

```tsx
const { renderStepContent, state, currentStep, renderStep } = useOnboarding()
```

**Issue:** Inconsistent naming - docs mention `renderStepContent` but API has `renderStep`

### 2. **OnboardingProvider Props Documentation** ⚠️

**Issues:**

- Props mention `localStoragePersistence?: { key: string; ttl?: number }` (documented as correct)
- Missing `componentRegistry` description that it can be overridden by `OnboardingStep.component`
- Missing newer config options: `publicKey`, `apiHost`, `cloudOptions`, `userId`, `analytics`, `debug`, `flowId`, `flowName`, `flowVersion`, `flowMetadata`

### 3. **State Management References** ⚠️

**Issue:** Docs mention `useOnboarding()` should access engine via `state` object

- `currentStep` is returned directly from hook (not via `state`)
- `isCompleted` is returned directly from hook
- Should clarify structure

### 4. **useOnboarding Hook Deprecation Notices** ⚠️

**Issue:** Hook return type includes deprecation notice for `isLoading`

- Docs suggest it's the primary way to check loading
- Type definition shows it's deprecated in favor of `loading.isAnyLoading`
- Docs should guide users to use granular loading state

---

## 5. Missing Examples

### 1. **Multi-Engine Management** ❌

- **Missing:** Guide on using `OnboardingEngineRegistry` for managing multiple flows
- **Use Case:** Applications with multiple onboarding paths (e.g., different user segments)

### 2. **Analytics Integration** ❌

- **Missing:** How to integrate custom analytics providers
- **Missing:** How to track aha moments
- **Missing:** How to use performance and session trackers
- **Missing:** How to configure `analytics` config option with `before_send` hook

### 3. **Advanced Error Handling** ❌

- **Missing:** How to use `ErrorHandler` and access error history
- **Missing:** How to report custom errors via `engine.reportError()`
- **Missing:** How to handle validation errors with `reportStepValidationFailure()`

### 4. **Performance Optimization** ❌

- **Missing:** How to access performance stats
- **Missing:** Cache management strategies
- **Missing:** How to use `AsyncOperationQueue`

### 5. **Flow Identification & Versioning** ❌

- **Missing:** How to use flowId, flowName, flowVersion, flowMetadata
- **Missing:** How to use `generatePersistenceKey()` for flow-aware persistence
- **Missing:** How to use `isVersionCompatible()` for version checking

### 6. **Pause/Resume/Abandon Flows** ❌

- **Missing:** How to pause onboarding (`pauseFlow()`)
- **Missing:** How to resume onboarding (`resumeFlow()`)
- **Missing:** How to abandon flows (`abandonFlow()`)
- **Missing:** How to track step abandonment (`abandonStep()`)

### 7. **Granular Loading States** ❌

- **Missing:** Examples showing how to use:
  - `loading.isHydrating` - Show skeleton during data load
  - `loading.isEngineProcessing` - Show spinner during navigation
  - `loading.isComponentProcessing` - Show validation spinner

### 8. **Event Listener Patterns** ⚠️

- **Partially Documented:** Basic `addEventListener()` shown
- **Missing:**
  - How to use specific listener methods (addBeforeStepChangeListener, etc.)
  - How to handle `beforeStepChange` event with `cancel()` and `redirect()`
  - How to track flow lifecycle events (pause, resume, abandon)
  - How to track step lifecycle events (retry, abandon)

### 9. **Custom Step Components with Inline Definition** ❌

- **Missing:** How to define `component` property on steps
- **Missing:** Example of step with inline component vs. registry lookup

### 10. **Debug Information** ❌

- **Missing:** How to access engine debug info via `getDebugInfo()`
- **Missing:** How to enable debug mode in config
- **Missing:** What debug information is available

---

## 6. Incomplete Examples

### 1. **Onboarding Config Page** ⚠️

The [src/app/onboarding-config/page.md](src/app/onboarding-config/page.md) example is incomplete:

**Current:**

```tsx
export const myAppOnboardingConfig: OnboardingEngineConfig = {
  steps: [
    /* ... your step objects ... */
  ],
  initialStepId: 'welcome',
  onFlowComplete: (context) => {
    /* ... */
  },
  onStepChange: (newStep, oldStep) => {
    /* ... */
  },
}
```

**Missing:**

- `initialContext` example
- `onStepActive` handler example
- `onStepComplete` handler example
- Flow identification options (flowId, flowName, flowVersion, flowMetadata)
- Analytics configuration
- Persistence options (loadData, persistData, clearPersistedData)
- Plugin configuration

### 2. **Event System Page** ⚠️

The [src/app/event-system/page.md](src/app/event-system/page.md) examples are incomplete:

**Available but not shown:**

- `beforeStepChange` with `redirect()` functionality
- Flow lifecycle events (pause, resume, abandon)
- Step lifecycle events (retry, abandon)
- `beforeStepChange` event cancellation with detailed example

### 3. **useOnboarding Hook Documentation** ⚠️

Missing example showing:

- How to access granular loading states
- How to use the `error` property
- How to use hook options (onFlowCompleted, onStepChange, etc.)
- How to use `engine` directly for advanced operations

---

## 7. Version & RC Status Issues

### 1. **RC Version Not Mentioned** ⚠️

- **Issue:** Documentation doesn't mention this is for RC release
- **Impact:** Users might expect stable API
- **Recommendation:** Add RC notice to homepage and key pages

### 2. **API Stability Warnings Missing** ❌

- **Issue:** No warning that advanced APIs may change before v1.0
- **Missing:** Pages for experimental features

### 3. **Migration Guide Missing** ❌

- **Issue:** No documentation on migrating from any beta versions
- **Impact:** Users upgrading won't have guidance

---

## 8. Type Definition Inconsistencies

### 1. **Return Type Naming** ⚠️

- `useOnboarding()` docs mention `renderStepContent()` but actual API has `renderStep()`
- Should update documentation to match implementation

### 2. **Loading State Type Mismatch** ⚠️

- `useOnboarding()` hook has both:
  - `isLoading: boolean` (deprecated)
  - `loading: LoadingState` (new, with granular states)
- Docs only show `isLoading` as boolean

### 3. **State Access Inconsistency** ⚠️

- Docs show accessing `state.currentStep`
- But also show `currentStep` returned directly from hook
- Both are correct but confusing presentation

---

## 9. Specific Discrepancy Examples

### Example 1: Missing useOnboarding Options

**Documentation shows:**

```tsx
const { state, next, previous, skip, goToStep, updateContext, renderStep } =
  useOnboarding()
```

**Actual TypeScript signature accepts:**

```tsx
const options = {
  onFlowCompleted?: (event) => void,
  onStepChange?: (newStep, oldStep, context) => void,
  onBeforeStepChange?: (event) => void,
  loadData?: () => Promise<TContext>,
  persistData?: (context) => Promise<void>
}
useOnboarding(options)
```

### Example 2: Missing Engine Methods

**Docs don't mention you can:**

```tsx
const { engine } = useOnboarding()

// Advanced operations not in docs:
engine.pauseFlow('user_action')
engine.resumeFlow()
engine.abandonFlow('user_closed_tab')
engine.trackCustomEvent('important_action', { details: '...' })
engine.getPerformanceStats()
engine.getDebugInfo()
```

### Example 3: Incomplete Analytics

**Documentation only mentions:**

```tsx
const { trackAha } = useOnboardingAnalytics()
```

**But doesn't mention:**

- Registering custom `AnalyticsProvider`
- Using `SessionTracker`, `PerformanceTracker`, `ActivityTracker`
- The `before_send` hook in analytics config
- Event filtering and modification

### Example 4: Missing Checklist Type

**Type definitions include:**

```tsx
type OnboardingStepType =
  | 'INFORMATION'
  | 'MULTIPLE_CHOICE'
  | 'SINGLE_CHOICE'
  | 'CONFIRMATION'
  | 'CUSTOM_COMPONENT'
  | 'CHECKLIST'
```

**But documentation shows:**

- INFORMATION ✅
- MULTIPLE_CHOICE ✅
- SINGLE_CHOICE ✅
- CONFIRMATION - not shown in examples
- CUSTOM_COMPONENT - not shown in examples
- CHECKLIST - not documented at all

---

## 10. Summary of Issues by Severity

### 🔴 Critical (Breaks Understanding)

| Issue                                 | Page              | Impact                                  |
| ------------------------------------- | ----------------- | --------------------------------------- |
| Missing OnboardingEngineRegistry docs | All               | Users can't manage multiple flows       |
| Analytics API not documented          | All               | Analytics features unusable             |
| Missing engine advanced methods       | All               | Users missing key functionality         |
| Incomplete configuration options      | Onboarding Config | Users can't configure advanced features |

### 🟡 Major (Incomplete)

| Issue                             | Page               | Impact                                  |
| --------------------------------- | ------------------ | --------------------------------------- |
| Loading state API incomplete      | useOnboarding Hook | Users can't optimize UX                 |
| Event system incomplete           | Event System       | Users miss flow lifecycle events        |
| Plugin hooks undocumented         | Plugin Overview    | Plugin developers can't use React hooks |
| Granular loading examples missing | useOnboarding Hook | Users use deprecated API                |

### 🟢 Minor (Nice to Have)

| Issue                       | Page     | Impact                            |
| --------------------------- | -------- | --------------------------------- |
| Missing debug examples      | All      | Debugging harder for users        |
| RC version not mentioned    | Homepage | Users don't know it's pre-release |
| Performance stats not shown | All      | Users can't optimize performance  |

---

## 11. Recommendations

### Phase 1: Critical Fixes (Before RC Release)

1. ✅ Add `OnboardingEngineRegistry` documentation page
2. ✅ Add comprehensive analytics guide with examples
3. ✅ Document all engine methods (pause, resume, abandon, track, etc.)
4. ✅ Complete `OnboardingEngineConfig` documentation
5. ✅ Add granular loading state examples to `useOnboarding` page
6. ✅ Fix `renderStepContent` → `renderStep` naming inconsistency
7. ✅ Document checklist step type with example
8. ✅ Add RC version notice to all pages

### Phase 2: Important Additions (Before v1.0)

1. Add "Advanced Usage" section covering:
   - Multi-flow management with registry
   - Performance optimization
   - Custom analytics providers
   - Error handling patterns
2. Add debugging guide showing `getDebugInfo()`
3. Add flow lifecycle examples (pause, resume, abandon)
4. Add hook options documentation with examples
5. Add `useSuspenseEngine` documentation
6. Add Result type / error handling guide

### Phase 3: Polish (Post v1.0)

1. Add detailed API reference for each exported class
2. Add video tutorials for common patterns
3. Add interactive examples/playground
4. Add troubleshooting guide

---

## 12. File-by-File Analysis

### [react/overview/page.md](react/overview/page.md)

**Status:** ✅ Good overview, but missing:

- Mention of advanced features (registry, analytics)
- Link to advanced usage guide
- RC version notice

### [react/onboarding-provider/page.md](react/onboarding-provider/page.md)

**Status:** ⚠️ Props table missing:

- `publicKey`, `apiHost`, `cloudOptions` - cloud options
- `userId` - analytics user ID
- `analytics` - analytics configuration
- `debug` - debug mode
- `flowId`, `flowName`, `flowVersion`, `flowMetadata` - flow identification
- Note about `OnboardingStep.component` override

### [react/use-onboarding-hook/page.md](react/use-onboarding-hook/page.md)

**Status:** ⚠️ Missing:

- Hook options parameter documentation
- `loading` object with granular states
- `error` property
- `engine` direct access use cases
- Example of accessing granular loading states
- Fix `renderStepContent` reference (should be `renderStep`)

### [onboarding-config/page.md](onboarding-config/page.md)

**Status:** ⚠️ Incomplete:

- Only shows basic example
- Missing many config options
- No examples of callbacks
- No persistence config examples
- No analytics config example
- No flow identification example

### [steps/defining-steps/page.md](steps/defining-steps/page.md)

**Status:** ✅ Good, but missing:

- `CHECKLIST` step type
- `CUSTOM_COMPONENT` step type
- Step `component` property for inline components
- Link to step type reference page

### [event-system/page.md](event-system/page.md)

**Status:** ⚠️ Missing:

- Flow lifecycle events (pause, resume, abandon)
- Step lifecycle events (retry, abandon)
- Complete event payload types
- Advanced `beforeStepChange` example with redirect
- Session tracking and activity tracking events

### [plugins/overview/page.md](plugins/overview/page.md)

**Status:** ⚠️ Missing:

- How to create custom plugins
- `ReactPlugin` and `ReactPluginHooks`
- Plugin lifecycle methods
- `onReactMount` and `onReactUnmount` hooks
- Link to plugin development guide

### [persistence/page.md](persistence/page.md)

**Status:** ✅ Good, but missing:

- Flow-aware persistence with `generatePersistenceKey()`
- Versioning strategies
- Migration patterns
- Multi-flow persistence scenarios

---

## Appendix: Complete Missing API List

### @onboardjs/core Missing from Docs

- `OnboardingEngineRegistry` (class)
- `AnalyticsManager` (class)
- `AnalyticsCoordinator` (class)
- `SessionTracker` (class)
- `PerformanceTracker` (class)
- `ActivityTracker` (class)
- `ProgressMilestoneTracker` (class)
- `AhaTracker` (class)
- `EventManager` (class)
- `NavigationManager` (class)
- `ChecklistManager` (class)
- `ErrorHandler` (class)
- `AsyncOperationQueue` (class)
- Result type methods (map, mapErr, andThen, safeSync, safeAsync, fromPromise)
- `StepValidator` methods (isValid, getErrors, getWarnings)
- `ConfigurationBuilder` methods
- StepUtils and FlowUtils
- Multiple engine methods (pause, resume, abandon, track, debug, etc.)

### @onboardjs/react Missing from Docs

- `useSuspenseEngine` hook
- `LoadingState` type details
- Granular loading states (isHydrating, isEngineProcessing, isComponentProcessing)
- `ReactPlugin` and `ReactPluginHooks`
- `onReactMount` and `onReactUnmount` hooks
- Step inline `component` property
- Hook options parameters (onFlowCompleted, onStepChange, onBeforeStepChange)
- `error` property from useOnboarding
- Direct `engine` access documentation
- Utility functions (createStepsHash, createConfigHash, areStepsEqual, etc.)

---

## Conclusion

The documentation provides a solid foundation for getting started with OnboardJS, but is missing significant portions of the actual API surface. Before shipping RC.3, the documentation should be updated to include:

1. **Registry and multi-flow management**
2. **Complete analytics documentation**
3. **All engine methods and their use cases**
4. **Complete configuration options**
5. **Granular loading state examples**
6. **Flow lifecycle management**

The current documentation covers approximately **60-70%** of the actual exported API. With these additions, it would cover **85-90%**, providing users with comprehensive guidance on using all major features.
