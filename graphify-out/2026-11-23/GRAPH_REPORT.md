# Graph Report - Dompetku  (2026-11-23)

## Corpus Check
- 125 files · ~180,162 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 868 nodes · 2616 edges · 43 communities (39 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7906f929`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- finance.ts
- prd-phase-3-local-financial-ai-assistant.md
- AppProviders.tsx
- theme/index.ts
- types/index.ts
- SPEC — ForgeOS Project
- expo
- DebtListScreen.tsx
- settingsStore.ts
- MoneyDropAnimation.tsx
- SPACING
- DebtFormScreen.tsx
- react-native-safe-area-context
- common/index.ts
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- react
- DateInput.tsx
- dompetku-prd.md
- scripts
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- RADIUS
- 5. Technology Stack
- ReportScreen.tsx
- react-native
- 11. Data Models
- 12. Financial Calculations
- 10. Dashboard Widgets
- Income Module
- Settings Module
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- DebtDetailScreen.tsx
- CLAUDE.md
- COLORS

## God Nodes (most connected - your core abstractions)
1. `react` - 72 edges
2. `COLORS` - 65 edges
3. `react-native` - 60 edges
4. `FONTS` - 53 edges
5. `Text()` - 52 edges
6. `SPACING` - 50 edges
7. `RADIUS` - 47 edges
8. `Card()` - 46 edges
9. `formatCurrency()` - 46 edges
10. `react-native-safe-area-context` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 — MVP (must have)` --references--> `DashboardScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/dashboard/DashboardScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx
- `Realm Models (10 total)` --references--> `CategoryModel`  [INFERRED]
  docs/project-context.md → src/models/CategoryModel.ts
- `Realm Models (10 total)` --references--> `DebtModel`  [INFERRED]
  docs/project-context.md → src/models/DebtModel.ts

## Import Cycles
- None detected.

## Communities (43 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "finance.ts"
Cohesion: 0.07
Nodes (41): expo-linear-gradient, FAB(), lighten(), Props, styles, AssetsNavigator(), Stack, AssetsStackParamList (+33 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "AppProviders.tsx"
Cohesion: 0.22
Nodes (8): AppInner(), AppProviders(), navTheme, styles, ErrorBoundary, registerDebtReminderBackgroundTask(), unregisterLegacyBackgroundTasks(), requestNotificationPermissions()

### Community 4 - "theme/index.ts"
Cohesion: 0.17
Nodes (12): ColorKey, Theme, THEME_ID, themeStorage, berry, DEFAULT_THEME_ID, lilac, PALETTES (+4 more)

### Community 6 - "types/index.ts"
Cohesion: 0.08
Nodes (24): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, AssetCategory, Category (+16 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+16 more)

### Community 9 - "DebtListScreen.tsx"
Cohesion: 0.06
Nodes (65): Realm Models (10 total), dayjs, expo-background-task, expo-notifications, expo-task-manager, realm, realmConfig, CategoryModel (+57 more)

### Community 10 - "settingsStore.ts"
Cohesion: 0.24
Nodes (10): react-native-mmkv, zustand, getSettings(), saveSettings(), storage, StorageKeys, DEFAULT_SETTINGS, SettingsState (+2 more)

### Community 11 - "MoneyDropAnimation.tsx"
Cohesion: 0.09
Nodes (18): react-native-reanimated, AssetMoveKind, CONFIG, Props, DebtPaymentKind, Props, TITLE, Coin() (+10 more)

### Community 12 - "SPACING"
Cohesion: 0.25
Nodes (6): EmptyStateProps, styles, Props, State, styles, SPACING

### Community 14 - "DebtFormScreen.tsx"
Cohesion: 0.05
Nodes (35): @hookform/resolvers, react-hook-form, @react-navigation/native, zod, DebtType, Category, CATEGORY_OPTIONS, categoryOf() (+27 more)

### Community 15 - "react-native-safe-area-context"
Cohesion: 0.20
Nodes (12): react-native-safe-area-context, @react-navigation/native-stack, @realm/react, CategoryType, styles, CategoryFormScreen(), EMOJI_OPTIONS, Props (+4 more)

### Community 16 - "common/index.ts"
Cohesion: 0.07
Nodes (66): @expo/vector-icons, AmountDisplay(), Card(), ProgressBar(), Text(), CashflowCalendarCard(), DailyTotals, Props (+58 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+24 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DiagnosisScreen.tsx"
Cohesion: 0.18
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 21 - "react"
Cohesion: 0.13
Nodes (18): react, @react-navigation/bottom-tabs, CardProps, styles, DebtNavigator(), Stack, InvestmentNavigator(), SettingsNavigator() (+10 more)

### Community 22 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.11
Nodes (18): App(), devDependencies, @types/react, typescript, main, name, private, version (+10 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "RADIUS"
Cohesion: 0.12
Nodes (19): ProgressBarProps, styles, SavingsNavigator(), Stack, ModalType, Props, styles, TYPE_COLOR (+11 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "ReportScreen.tsx"
Cohesion: 0.14
Nodes (16): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+8 more)

### Community 34 - "react-native"
Cohesion: 0.12
Nodes (16): react-native, BackButtonProps, styles, ButtonProps, styles, CurrencyInputProps, styles, CATEGORIES (+8 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 56 - "DebtDetailScreen.tsx"
Cohesion: 0.06
Nodes (78): AssetSuccessAnimation(), BackButton(), Button(), CurrencyInput(), formatThousands(), DateInput(), DebtPaymentSuccessAnimation(), EmptyState() (+70 more)

### Community 84 - "COLORS"
Cohesion: 0.16
Nodes (12): AmountDisplayProps, sizes, styles, InputProps, styles, TextProps, variantStyles, weightMap (+4 more)

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 478 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ReportScreen.tsx`, `react-native`, `AppProviders.tsx`, `finance.ts`, `DebtListScreen.tsx`, `MoneyDropAnimation.tsx`, `SPACING`, `DebtFormScreen.tsx`, `react-native-safe-area-context`, `common/index.ts`, `COLORS`, `DiagnosisScreen.tsx`, `DateInput.tsx`, `DebtDetailScreen.tsx`, `package.json`, `RADIUS`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `finance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06826241134751773 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ReportScreen.tsx`, `finance.ts`, `AppProviders.tsx`, `theme/index.ts`, `DebtListScreen.tsx`, `MoneyDropAnimation.tsx`, `SPACING`, `DebtFormScreen.tsx`, `react-native-safe-area-context`, `common/index.ts`, `COLORS`, `react`, `DateInput.tsx`, `DiagnosisScreen.tsx`, `DebtDetailScreen.tsx`, `package.json`, `RADIUS`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._