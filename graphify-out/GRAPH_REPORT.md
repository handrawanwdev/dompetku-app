# Graph Report - Dompetku  (2026-11-24)

## Corpus Check
- 135 files · ~180,567 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 884 nodes · 2823 edges · 46 communities (42 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7906f929`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- InvestmentListScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- @expo/vector-icons
- COLORS
- ExpenseFormScreen.tsx
- Text
- SPEC — ForgeOS Project
- expo
- DebtDetailScreen.tsx
- DebtReminderBackgroundTask.ts
- DebtRatioCard.tsx
- react
- theme/index.ts
- DateInput.tsx
- react-native
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- DataScreen.tsx
- AppProviders.tsx
- dompetku-prd.md
- RADIUS
- WalletScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- scripts
- 5. Technology Stack
- react-native-safe-area-context
- NotificationService.ts
- 11. Data Models
- 12. Financial Calculations
- NetWorthCard.tsx
- 10. Dashboard Widgets
- CategoriesScreen.tsx
- devDependencies
- Income Module
- Settings Module
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `COLORS` - 71 edges
3. `react-native` - 63 edges
4. `Text()` - 62 edges
5. `FONTS` - 56 edges
6. `SPACING` - 53 edges
7. `formatCurrency()` - 52 edges
8. `RADIUS` - 50 edges
9. `Card()` - 44 edges
10. `@expo/vector-icons` - 37 edges

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

## Communities (46 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "InvestmentListScreen.tsx"
Cohesion: 0.05
Nodes (54): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), dayjs, expo-linear-gradient, GroupedBarChart() (+46 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "@expo/vector-icons"
Cohesion: 0.17
Nodes (10): @expo/vector-icons, BackButtonProps, styles, styles, styles, Props, styles, Props (+2 more)

### Community 4 - "COLORS"
Cohesion: 0.21
Nodes (10): ButtonProps, styles, CardProps, styles, InputProps, styles, DAY_LABELS, styles (+2 more)

### Community 5 - "ExpenseFormScreen.tsx"
Cohesion: 0.06
Nodes (80): @hookform/resolvers, react-hook-form, @react-navigation/native-stack, zod, AssetSuccessAnimation(), BackButton(), Button(), CurrencyInput() (+72 more)

### Community 6 - "Text"
Cohesion: 0.07
Nodes (64): AmountDisplay(), Card(), Text(), BirthdayCard(), BudgetSplitCard(), CashflowCalendarCard(), short(), DebtRatioCard() (+56 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+16 more)

### Community 9 - "DebtDetailScreen.tsx"
Cohesion: 0.14
Nodes (23): @react-navigation/native, ProgressBar(), DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles (+15 more)

### Community 10 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.20
Nodes (8): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, realmConfig, LEGACY_TASK_NAMES, storage, StorageKeys

### Community 11 - "DebtRatioCard.tsx"
Cohesion: 0.18
Nodes (8): Props, styles, WEEKDAYS, Props, styles, Tone, Props, styles

### Community 12 - "react"
Cohesion: 0.13
Nodes (17): react, AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, COINS (+9 more)

### Community 13 - "theme/index.ts"
Cohesion: 0.15
Nodes (15): styles, ThemeScreen(), ColorKey, setThemeId(), Theme, THEME_ID, themeStorage, berry (+7 more)

### Community 14 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 16 - "react-native"
Cohesion: 0.12
Nodes (16): react-native, react-native-svg, GroupedBarChartProps, GroupedDataPoint, styles, AmountDisplayProps, sizes, styles (+8 more)

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
Cohesion: 0.20
Nodes (16): expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs(), ErrorLogEntry (+8 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.09
Nodes (50): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, IncomeModel (+42 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.36
Nodes (8): AppInner(), AppProviders(), navTheme, styles, RootNavigator(), registerDebtReminderBackgroundTask(), unregisterLegacyBackgroundTasks(), requestNotificationPermissions()

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 25 - "RADIUS"
Cohesion: 0.14
Nodes (13): ProgressBarProps, styles, Props, Reminder, styles, Props, Reminder, styles (+5 more)

### Community 26 - "WalletScreen.tsx"
Cohesion: 0.16
Nodes (14): @react-navigation/bottom-tabs, HeroAction(), styles, WalletScreen(), Stack, TransactionNavigator(), CashflowStackParamList, MainTabNavigator() (+6 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.11
Nodes (18): App(), main, name, private, version, babel-preset-expo, expo, expo-dev-client (+10 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "react-native-safe-area-context"
Cohesion: 0.20
Nodes (5): react-native-safe-area-context, ErrorBoundary, Props, State, styles

### Community 34 - "NotificationService.ts"
Cohesion: 0.43
Nodes (7): cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders(), scheduleAt()

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "NetWorthCard.tsx"
Cohesion: 0.25
Nodes (6): Props, styles, Summary, styles, Summary, DashboardData

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "CategoriesScreen.tsx"
Cohesion: 0.05
Nodes (52): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, migrateDebtsToV17(), NewExpense (+44 more)

### Community 42 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, @types/react, typescript

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

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 450 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `InvestmentListScreen.tsx`, `@expo/vector-icons`, `COLORS`, `ExpenseFormScreen.tsx`, `Text`, `DebtDetailScreen.tsx`, `DebtRatioCard.tsx`, `theme/index.ts`, `DateInput.tsx`, `react-native`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `RADIUS`, `WalletScreen.tsx`, `package.json`, `react-native-safe-area-context`, `NetWorthCard.tsx`, `CategoriesScreen.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `InvestmentListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05261261261261261 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `InvestmentListScreen.tsx`, `@expo/vector-icons`, `COLORS`, `ExpenseFormScreen.tsx`, `Text`, `DebtDetailScreen.tsx`, `DebtRatioCard.tsx`, `react`, `theme/index.ts`, `DateInput.tsx`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `RADIUS`, `WalletScreen.tsx`, `package.json`, `react-native-safe-area-context`, `NetWorthCard.tsx`, `CategoriesScreen.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._