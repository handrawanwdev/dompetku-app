# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 156 files · ~195,777 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1038 nodes · 3596 edges · 59 communities (53 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82ef5cb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- realm.ts
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- react-native
- today
- Text
- SPEC — ForgeOS Project
- expo
- RootNavigator.tsx
- ProfileScreen.tsx
- navigation/types.ts
- ActivityScreen.tsx
- react
- theme/index.ts
- react-native-safe-area-context
- ReportScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- DataScreen.tsx
- AppProviders.tsx
- dompetku-prd.md
- @expo/vector-icons
- formatCurrency
- GoalFormScreen.tsx
- ExpenseFormScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- PhysicalAssetListScreen.tsx
- 5. Technology Stack
- PassiveIncomeListScreen.tsx
- CashflowScreen.tsx
- 11. Data Models
- 12. Financial Calculations
- constants/index.ts
- InvestmentListScreen.tsx
- 10. Dashboard Widgets
- InvestmentFormScreen.tsx
- CategoriesScreen.tsx
- RemindersSection.tsx
- Income Module
- Settings Module
- palettes.ts
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- COLORS
- NotificationService.ts
- Financial Freedom Level System — Implementation Plan
- TransactionNavigator.tsx
- sha256.ts
- RemindersBell.tsx
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

## Communities (59 total, 6 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "realm.ts"
Cohesion: 0.21
Nodes (13): migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig, ALL_MODELS, DataScreen(), Row() (+5 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "react-native"
Cohesion: 0.09
Nodes (30): react-native, AmountDisplayProps, sizes, styles, ButtonProps, styles, CurrencyInputProps, styles (+22 more)

### Community 5 - "today"
Cohesion: 0.53
Nodes (6): AccountFormScreen(), addAdjustment(), addOpeningBalance(), getAccountBalances(), setAccountBalance(), today()

### Community 6 - "Text"
Cohesion: 0.17
Nodes (27): Text(), BirthdayCard(), styles, BudgetSplitCard(), CashflowCalendarCard(), DayEntry, short(), Stat() (+19 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "RootNavigator.tsx"
Cohesion: 0.07
Nodes (44): zustand, Card(), MainMenuCard(), styles, Tile(), IconBtn(), ItemHead(), MenuEditScreen() (+36 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.14
Nodes (25): dayjs, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles (+17 more)

### Community 11 - "navigation/types.ts"
Cohesion: 0.14
Nodes (23): @react-navigation/native-stack, ProgressBar(), DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles (+15 more)

### Community 12 - "ActivityScreen.tsx"
Cohesion: 0.16
Nodes (17): ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS, Props (+9 more)

### Community 13 - "react"
Cohesion: 0.11
Nodes (23): react, AssetMoveKind, AssetSuccessAnimation(), CONFIG, Props, BackButtonProps, styles, CONFIG (+15 more)

### Community 14 - "theme/index.ts"
Cohesion: 0.13
Nodes (15): CardProps, styles, HeroAction(), styles, styles, ThemeScreen(), Tab, tabStyles (+7 more)

### Community 15 - "react-native-safe-area-context"
Cohesion: 0.12
Nodes (41): expo-secure-store, react-native-safe-area-context, @react-navigation/native, AppLockGate(), formatWait(), LockScreen(), Mode, styles (+33 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.20
Nodes (15): Phase 1 — MVP (must have), react-native-svg, GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, CategoryBarList(), categoryBreakdown() (+7 more)

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
Cohesion: 0.19
Nodes (17): react-native-mmkv, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, pauseAutoLock(), buildReportText(), clearErrorLogs() (+9 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.08
Nodes (56): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel (+48 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.11
Nodes (18): App(), expo, expo-background-task, expo-status-bar, expo-task-manager, react-native-gesture-handler, AppInner(), AppProviders() (+10 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "@expo/vector-icons"
Cohesion: 0.14
Nodes (16): @expo/vector-icons, styles, Props, styles, Tone, Props, styles, Summary (+8 more)

### Community 25 - "formatCurrency"
Cohesion: 0.24
Nodes (19): BackButton(), PhysicalAssetSellScreen(), AccountDetailScreen(), useAccounts(), GoalDetailScreen(), Props, Row(), styles (+11 more)

### Community 26 - "GoalFormScreen.tsx"
Cohesion: 0.19
Nodes (15): Stack, GoalFormScreen(), Props, styles, toNumber(), GoalStackParamList, buildGoalInfo(), buildGoalInfos() (+7 more)

### Community 27 - "ExpenseFormScreen.tsx"
Cohesion: 0.13
Nodes (28): @hookform/resolvers, react-hook-form, zod, Button(), CurrencyInput(), formatThousands(), DateInput(), Input (+20 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.08
Nodes (24): devDependencies, @types/react, typescript, main, name, private, scripts, android (+16 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.17
Nodes (14): expo-linear-gradient, FAB(), lighten(), Props, styles, AssetsNavigator(), Stack, AssetsStackParamList (+6 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.16
Nodes (17): PassiveIncomeNavigator(), Stack, NavProp, Props, RoutePropT, styles, categoryMeta(), PassiveIncomeListScreen() (+9 more)

### Community 34 - "CashflowScreen.tsx"
Cohesion: 0.22
Nodes (13): AmountDisplay(), ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryFilter(), CategoryOption, ExpenseItem(), INCOME_EMOJIS (+5 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "constants/index.ts"
Cohesion: 0.20
Nodes (9): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, Props, AssetCategory, InvestmentType (+1 more)

### Community 38 - "InvestmentListScreen.tsx"
Cohesion: 0.23
Nodes (11): EmptyState(), InvestmentNavigator(), Stack, InvestmentListScreen(), InvestmentStackParamList, styles, SummaryCol(), TYPE_EMOJIS (+3 more)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "InvestmentFormScreen.tsx"
Cohesion: 0.12
Nodes (21): InvestmentSuccessAnimation(), PurchaseToggle(), CATEGORIES, Field(), fs, NavProp, PhysicalAssetFormScreen(), Props (+13 more)

### Community 41 - "CategoriesScreen.tsx"
Cohesion: 0.18
Nodes (14): DEFAULT_INCOME_CATEGORIES, CategoryType, styles, CategoryFormScreen(), EMOJI_OPTIONS, Props, styles, RootStackParamList (+6 more)

### Community 42 - "RemindersSection.tsx"
Cohesion: 0.17
Nodes (10): Props, Reminder, styles, Props, Reminder, styles, Props, Reminder (+2 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "palettes.ts"
Cohesion: 0.18
Nodes (10): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, peach, rose (+2 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "COLORS"
Cohesion: 0.14
Nodes (12): ProgressBarProps, styles, Props, styles, TextProps, variantStyles, weightMap, Key() (+4 more)

### Community 51 - "NotificationService.ts"
Cohesion: 0.39
Nodes (7): expo-notifications, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshDailyReminders(), refreshDebtReminders(), scheduleAt()

### Community 52 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.40
Nodes (4): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 53 - "TransactionNavigator.tsx"
Cohesion: 0.50
Nodes (3): Stack, TransactionNavigator(), CashflowStackParamList

### Community 54 - "sha256.ts"
Cohesion: 0.67
Nodes (3): K, sha256(), utf8()

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `react-native`, `Text`, `RootNavigator.tsx`, `ProfileScreen.tsx`, `navigation/types.ts`, `ActivityScreen.tsx`, `theme/index.ts`, `react-native-safe-area-context`, `ReportScreen.tsx`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `@expo/vector-icons`, `formatCurrency`, `GoalFormScreen.tsx`, `ExpenseFormScreen.tsx`, `package.json`, `PhysicalAssetListScreen.tsx`, `PassiveIncomeListScreen.tsx`, `CashflowScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `CategoriesScreen.tsx`, `RemindersSection.tsx`, `COLORS`, `TransactionNavigator.tsx`, `RemindersBell.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `Text`, `RootNavigator.tsx`, `ProfileScreen.tsx`, `navigation/types.ts`, `ActivityScreen.tsx`, `react`, `theme/index.ts`, `react-native-safe-area-context`, `ReportScreen.tsx`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `@expo/vector-icons`, `formatCurrency`, `GoalFormScreen.tsx`, `ExpenseFormScreen.tsx`, `package.json`, `PhysicalAssetListScreen.tsx`, `PassiveIncomeListScreen.tsx`, `CashflowScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `CategoriesScreen.tsx`, `RemindersSection.tsx`, `COLORS`, `RemindersBell.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._