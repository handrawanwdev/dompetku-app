# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 156 files · ~195,763 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1034 nodes · 3592 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82ef5cb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- DebtReminderBackgroundTask.ts
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- SPACING
- BackButton
- Card
- SPEC — ForgeOS Project
- expo
- @expo/vector-icons
- ProfileScreen.tsx
- Text
- ActivityScreen.tsx
- common/index.ts
- theme/index.ts
- AppLockGate.tsx
- FONTS
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- DataScreen.tsx
- AppProviders.tsx
- dompetku-prd.md
- ErrorBoundary
- ProfileEditScreen.tsx
- GoalDetailScreen.tsx
- ExpenseFormScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- react-native
- 5. Technology Stack
- PhysicalAssetFormScreen.tsx
- CashflowScreen.tsx
- 11. Data Models
- 12. Financial Calculations
- CategoryService.ts
- COLORS
- 10. Dashboard Widgets
- InvestmentFormScreen.tsx
- budget.ts
- DateInput.tsx
- Income Module
- Settings Module
- react-native-safe-area-context
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- react
- scripts
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 91 edges
2. `react` - 89 edges
3. `COLORS` - 84 edges
4. `react-native` - 75 edges
5. `FONTS` - 66 edges
6. `SPACING` - 64 edges
7. `formatCurrency()` - 63 edges
8. `RADIUS` - 60 edges
9. `@expo/vector-icons` - 50 edges
10. `Card()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx
- `Realm Models (10 total)` --references--> `CategoryModel`  [INFERRED]
  docs/project-context.md → src/models/CategoryModel.ts
- `Realm Models (10 total)` --references--> `DebtModel`  [INFERRED]
  docs/project-context.md → src/models/DebtModel.ts
- `Realm Models (10 total)` --references--> `ExpenseModel`  [INFERRED]
  docs/project-context.md → src/models/ExpenseModel.ts

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.11
Nodes (19): expo-background-task, expo-notifications, expo-task-manager, migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig (+11 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "SPACING"
Cohesion: 0.16
Nodes (11): Props, State, styles, lighten(), Props, styles, InputProps, styles (+3 more)

### Community 5 - "BackButton"
Cohesion: 0.16
Nodes (27): BackButton(), Button(), CurrencyInput(), PurchaseToggle(), PhysicalAssetFormScreen(), PhysicalAssetSellScreen(), AccountFormScreen(), Props (+19 more)

### Community 6 - "Card"
Cohesion: 0.06
Nodes (63): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), GroupedBarChart(), Card(), BirthdayCard() (+55 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "@expo/vector-icons"
Cohesion: 0.19
Nodes (16): @expo/vector-icons, styles, IconBtn(), ItemHead(), MenuEditScreen(), styles, GROUPS, styles (+8 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.21
Nodes (14): dayjs, birthdayLine(), currentAge(), FIELDS, profileCompleteness(), InfoRow(), ProfileScreen(), styles (+6 more)

### Community 11 - "Text"
Cohesion: 0.13
Nodes (38): EmptyState(), FAB(), ProgressBar(), Text(), GoalsCard(), styles, DebtNavigator(), Stack (+30 more)

### Community 12 - "ActivityScreen.tsx"
Cohesion: 0.17
Nodes (15): ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS, Props (+7 more)

### Community 13 - "common/index.ts"
Cohesion: 0.10
Nodes (26): AmountDisplay(), AmountDisplayProps, sizes, styles, AssetMoveKind, AssetSuccessAnimation(), CONFIG, Props (+18 more)

### Community 14 - "theme/index.ts"
Cohesion: 0.15
Nodes (14): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, berry, DEFAULT_THEME_ID (+6 more)

### Community 15 - "AppLockGate.tsx"
Cohesion: 0.09
Nodes (49): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), KEYS, PinPad() (+41 more)

### Community 16 - "FONTS"
Cohesion: 0.13
Nodes (14): react-native-svg, GroupedBarChartProps, GroupedDataPoint, styles, ButtonProps, styles, EMOJI_OPTIONS, Props (+6 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DiagnosisScreen.tsx"
Cohesion: 0.17
Nodes (18): expo-file-system, expo-sharing, @react-navigation/native, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText() (+10 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.08
Nodes (61): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel (+53 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.21
Nodes (13): App(), expo, expo-status-bar, react-native-gesture-handler, AppInner(), AppProviders(), navTheme, styles (+5 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 25 - "ProfileEditScreen.tsx"
Cohesion: 0.31
Nodes (9): AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles, styles (+1 more)

### Community 26 - "GoalDetailScreen.tsx"
Cohesion: 0.15
Nodes (19): @react-navigation/native-stack, GoalNavigator(), Stack, Props, styles, GoalFormScreen(), Props, styles (+11 more)

### Community 27 - "ExpenseFormScreen.tsx"
Cohesion: 0.10
Nodes (34): @hookform/resolvers, react-hook-form, zod, DateInput(), Input, ExpenseFormScreen(), FormValues, NavProp (+26 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.10
Nodes (20): devDependencies, @types/react, typescript, main, name, private, version, babel-preset-expo (+12 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "react-native"
Cohesion: 0.14
Nodes (12): react-native, CurrencyInputProps, formatThousands(), styles, ProgressBarProps, styles, Props, styles (+4 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.06
Nodes (32): AssetsNavigator(), Stack, CATEGORIES, Field(), fs, NavProp, Props, RoutePropT (+24 more)

### Community 34 - "CashflowScreen.tsx"
Cohesion: 0.18
Nodes (9): ActiveTab, buildMonthOptions(), CategoryOption, INCOME_EMOJIS, MonthOption, styles, Stack, TransactionNavigator() (+1 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "CategoryService.ts"
Cohesion: 0.15
Nodes (14): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, DataScreen(), Row() (+6 more)

### Community 38 - "COLORS"
Cohesion: 0.24
Nodes (7): CardProps, styles, EmptyStateProps, styles, CategoryType, styles, COLORS

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "InvestmentFormScreen.tsx"
Cohesion: 0.11
Nodes (17): BackButtonProps, styles, Field(), fieldStyles, INVESTMENT_TYPES, NavProp, Props, RoutePropT (+9 more)

### Community 41 - "budget.ts"
Cohesion: 0.19
Nodes (15): react-native-mmkv, getSettings(), saveSettings(), StorageKeys, DEFAULT_SETTINGS, SettingsState, useSettingsStore, validTargets() (+7 more)

### Community 42 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "react-native-safe-area-context"
Cohesion: 0.22
Nodes (8): react-native-safe-area-context, styles, styles, MainTabNavigator(), Tab, TabIcon(), tabStyles, MainTabParamList

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "react"
Cohesion: 0.15
Nodes (12): react, Props, styles, TextProps, variantStyles, weightMap, Props, Reminder (+4 more)

### Community 53 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `SPACING`, `BackButton`, `Card`, `@expo/vector-icons`, `ProfileScreen.tsx`, `Text`, `ActivityScreen.tsx`, `common/index.ts`, `theme/index.ts`, `AppLockGate.tsx`, `FONTS`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `ProfileEditScreen.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `package.json`, `react-native`, `PhysicalAssetFormScreen.tsx`, `CashflowScreen.tsx`, `COLORS`, `InvestmentFormScreen.tsx`, `DateInput.tsx`, `react-native-safe-area-context`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `DebtReminderBackgroundTask.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `SPACING`, `BackButton`, `Card`, `@expo/vector-icons`, `ProfileScreen.tsx`, `Text`, `ActivityScreen.tsx`, `common/index.ts`, `theme/index.ts`, `AppLockGate.tsx`, `FONTS`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `ProfileEditScreen.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `package.json`, `PhysicalAssetFormScreen.tsx`, `CashflowScreen.tsx`, `COLORS`, `InvestmentFormScreen.tsx`, `DateInput.tsx`, `react-native-safe-area-context`, `react`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._