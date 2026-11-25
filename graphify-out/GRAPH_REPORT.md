# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 173 files · ~204,065 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1138 nodes · 4031 edges · 56 communities (51 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbd4a580`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- DiagnosisScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- react
- BackButton
- PhysicalAssetListScreen.tsx
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- ProfileScreen.tsx
- common/index.ts
- PassiveIncomeListScreen.tsx
- theme/index.ts
- AppLockService.ts
- PinFlowScreen.tsx
- ReportScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- InvestmentFormScreen.tsx
- DataScreen.tsx
- debt.ts
- dompetku-prd.md
- ReminderScheduler.ts
- GoalDetailScreen.tsx
- ExpenseFormScreen.tsx
- InvestmentListScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- settingsStore.ts
- 5. Technology Stack
- Text
- 11. Data Models
- 12. Financial Calculations
- AppLockGate.tsx
- InvestmentSuccessAnimation.tsx
- 10. Dashboard Widgets
- CurrencyInput.tsx
- sha256.ts
- ErrorBoundary.tsx
- Income Module
- Settings Module
- AppProviders.tsx
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- ReminderListScreen.tsx
- SettingsScreen.tsx
- ActivityScreen.tsx
- scripts
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 101 edges
2. `react` - 100 edges
3. `COLORS` - 93 edges
4. `react-native` - 84 edges
5. `FONTS` - 72 edges
6. `SPACING` - 71 edges
7. `formatCurrency()` - 68 edges
8. `RADIUS` - 67 edges
9. `@expo/vector-icons` - 55 edges
10. `BackButton()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Realm Models (10 total)` --references--> `CategoryModel`  [INFERRED]
  docs/project-context.md → src/models/CategoryModel.ts
- `Phase 1 — MVP (must have)` --references--> `DashboardScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/dashboard/DashboardScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx
- `Realm Models (10 total)` --references--> `DebtModel`  [INFERRED]
  docs/project-context.md → src/models/DebtModel.ts

## Import Cycles
- None detected.

## Communities (56 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "DiagnosisScreen.tsx"
Cohesion: 0.22
Nodes (15): DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs(), ErrorLogEntry, ErrorSource (+7 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.09
Nodes (23): ASSET_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, AssetCategory, Category, DashboardSummary (+15 more)

### Community 4 - "react"
Cohesion: 0.07
Nodes (52): @expo/vector-icons, react, react-native, EmptyStateProps, styles, InputProps, styles, COINS (+44 more)

### Community 5 - "BackButton"
Cohesion: 0.17
Nodes (17): AssetMoveKind, AssetSuccessAnimation(), CONFIG, Props, BackButton(), BackButtonProps, styles, InvestmentSuccessAnimation() (+9 more)

### Community 6 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.19
Nodes (11): CardProps, styles, AssetsNavigator(), Stack, AssetsStackParamList, CATEGORY_EMOJIS, CATEGORY_LABELS, DetailItem() (+3 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.08
Nodes (39): react-native-reanimated, BirthdayRecap, buildBirthdayRecap(), closingLine(), BirthdaySurprise(), CAKE_HINTS, GIFT_HINTS, Stage (+31 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.07
Nodes (42): @react-navigation/bottom-tabs, IconBtn(), ItemHead(), MenuEditScreen(), styles, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor() (+34 more)

### Community 11 - "common/index.ts"
Cohesion: 0.12
Nodes (26): expo-linear-gradient, AmountDisplay(), AmountDisplayProps, sizes, styles, EmptyState(), FAB(), lighten() (+18 more)

### Community 12 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.16
Nodes (18): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, categoryMeta() (+10 more)

### Community 13 - "theme/index.ts"
Cohesion: 0.06
Nodes (34): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE, Coin(), MoneyDropAnimation() (+26 more)

### Community 14 - "AppLockService.ts"
Cohesion: 0.21
Nodes (15): AppLockScreen(), Row(), styles, DeviceAuthInfo, getBiometricEnabled(), getRelockAfter(), K, pauseAutoLock() (+7 more)

### Community 15 - "PinFlowScreen.tsx"
Cohesion: 0.25
Nodes (16): LockScreen(), PinPad(), PinFlowScreen(), Props, Step, STEPS, styles, TEXT (+8 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.14
Nodes (19): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+11 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "InvestmentFormScreen.tsx"
Cohesion: 0.13
Nodes (20): PurchaseToggle(), CATEGORIES, Field(), fs, NavProp, PhysicalAssetFormScreen(), Props, RoutePropT (+12 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.08
Nodes (57): Realm Models (10 total), realm, @realm/react, AccountModel, DebtModel, ExpenseModel, GoalModel, IncomeModel (+49 more)

### Community 22 - "debt.ts"
Cohesion: 0.11
Nodes (22): dayjs, DEFAULT_EXPENSE_CATEGORIES, migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig, ALL_MODELS (+14 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "ReminderScheduler.ts"
Cohesion: 0.29
Nodes (16): BillReminderInput, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBillReminders(), refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders() (+8 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.18
Nodes (20): ProgressBar(), DebtDetailScreen(), Props, Row(), styles, useAccounts(), Stack, GoalDetailScreen() (+12 more)

### Community 26 - "ExpenseFormScreen.tsx"
Cohesion: 0.05
Nodes (85): @hookform/resolvers, react-hook-form, react-native-safe-area-context, @react-navigation/native, @react-navigation/native-stack, zod, Button(), ButtonProps (+77 more)

### Community 27 - "InvestmentListScreen.tsx"
Cohesion: 0.24
Nodes (10): InvestmentNavigator(), Stack, InvestmentListScreen(), InvestmentStackParamList, styles, SummaryCol(), TYPE_EMOJIS, TYPE_LABELS (+2 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.08
Nodes (26): devDependencies, @types/react, typescript, main, name, private, version, babel-preset-expo (+18 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "settingsStore.ts"
Cohesion: 0.31
Nodes (8): zustand, saveSettings(), DEFAULT_SETTINGS, SettingsState, validTargets(), AppSettings, KindTargets, sumTargets()

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 34 - "Text"
Cohesion: 0.18
Nodes (29): Card(), Text(), BirthdayCard(), styles, BudgetSplitCard(), styles, CashflowCalendarCard(), DayEntry (+21 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "AppLockGate.tsx"
Cohesion: 0.18
Nodes (13): AppLockGate(), formatWait(), Mode, styles, Key(), KEYS, Props, styles (+5 more)

### Community 38 - "InvestmentSuccessAnimation.tsx"
Cohesion: 0.50
Nodes (3): CONFIG, InvestmentMoveKind, Props

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "CurrencyInput.tsx"
Cohesion: 0.50
Nodes (3): CurrencyInputProps, formatThousands(), styles

### Community 41 - "sha256.ts"
Cohesion: 0.67
Nodes (3): K, sha256(), utf8()

### Community 42 - "ErrorBoundary.tsx"
Cohesion: 0.22
Nodes (4): ErrorBoundary, Props, State, styles

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "AppProviders.tsx"
Cohesion: 0.19
Nodes (14): App(), expo, expo-status-bar, react-native-gesture-handler, AppInner(), AppProviders(), navigationRef, navTheme (+6 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "ReminderListScreen.tsx"
Cohesion: 0.15
Nodes (23): ReminderModel, ReminderRepeat, NotifPermissionBanner(), NavProp, ReminderItem(), ReminderListScreen(), repeatLabel(), styles (+15 more)

### Community 51 - "SettingsScreen.tsx"
Cohesion: 0.32
Nodes (7): GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, isNotifOn(), NotifSettingKey

### Community 52 - "ActivityScreen.tsx"
Cohesion: 0.11
Nodes (26): AccountDetailScreen(), Action(), Props, Row, styles, ActivityScreen(), DropdownPill(), expenseDelta() (+18 more)

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 518 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DiagnosisScreen.tsx`, `BackButton`, `PhysicalAssetListScreen.tsx`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `common/index.ts`, `PassiveIncomeListScreen.tsx`, `theme/index.ts`, `AppLockService.ts`, `PinFlowScreen.tsx`, `ReportScreen.tsx`, `InvestmentFormScreen.tsx`, `DataScreen.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `InvestmentListScreen.tsx`, `package.json`, `Text`, `AppLockGate.tsx`, `InvestmentSuccessAnimation.tsx`, `CurrencyInput.tsx`, `ErrorBoundary.tsx`, `AppProviders.tsx`, `ReminderListScreen.tsx`, `SettingsScreen.tsx`, `ActivityScreen.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `COLORS` connect `react` to `DiagnosisScreen.tsx`, `BackButton`, `PhysicalAssetListScreen.tsx`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `common/index.ts`, `PassiveIncomeListScreen.tsx`, `theme/index.ts`, `AppLockService.ts`, `PinFlowScreen.tsx`, `ReportScreen.tsx`, `InvestmentFormScreen.tsx`, `DataScreen.tsx`, `debt.ts`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `InvestmentListScreen.tsx`, `Text`, `AppLockGate.tsx`, `InvestmentSuccessAnimation.tsx`, `CurrencyInput.tsx`, `ErrorBoundary.tsx`, `AppProviders.tsx`, `ReminderListScreen.tsx`, `SettingsScreen.tsx`, `ActivityScreen.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._