# Graph Report - Dompetku  (2026-11-27)

## Corpus Check
- 174 files · ~205,085 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1146 nodes · 4071 edges · 57 communities (52 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `172e81dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- AppLockGate.tsx
- prd-phase-3-local-financial-ai-assistant.md
- CategoriesScreen.tsx
- Card
- react-native
- ParametersScreen.tsx
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- @expo/vector-icons
- ExpenseFormScreen.tsx
- RADIUS
- theme/index.ts
- RootNavigator.tsx
- PhysicalAssetFormScreen.tsx
- PassiveIncomeListScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- palettes.ts
- DataScreen.tsx
- AccountFormScreen.tsx
- dompetku-prd.md
- package.json
- formatCurrency
- BackButton
- Build Lokal — Android SDK Required
- DiagnosisScreen.tsx
- tsconfig.json
- AppProviders.tsx
- 5. Technology Stack
- Financial Freedom Level System — Implementation Plan
- Text
- 11. Data Models
- 12. Financial Calculations
- react
- GroupedBarChart.tsx
- 10. Dashboard Widgets
- NetWorthCard.tsx
- DateInput.tsx
- Income Module
- Settings Module
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- MoneyDropAnimation.tsx
- ActivityScreen.tsx
- ProfileScreen.tsx
- InvestmentListScreen.tsx
- InvestmentFormScreen.tsx
- currency.ts
- hashPin
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 102 edges
2. `react` - 101 edges
3. `COLORS` - 94 edges
4. `react-native` - 85 edges
5. `FONTS` - 73 edges
6. `SPACING` - 72 edges
7. `formatCurrency()` - 69 edges
8. `RADIUS` - 68 edges
9. `@expo/vector-icons` - 55 edges
10. `BackButton()` - 48 edges

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

## Communities (57 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "AppLockGate.tsx"
Cohesion: 0.13
Nodes (38): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), PinPad(), AppLockScreen() (+30 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "CategoriesScreen.tsx"
Cohesion: 0.05
Nodes (48): react-native-mmkv, zustand, ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS (+40 more)

### Community 4 - "Card"
Cohesion: 0.12
Nodes (35): Card(), BirthdayCard(), styles, BudgetSplitCard(), styles, CashflowCalendarCard(), DayEntry, short() (+27 more)

### Community 5 - "react-native"
Cohesion: 0.10
Nodes (20): react-native, AmountDisplayProps, sizes, styles, Props, State, styles, InputProps (+12 more)

### Community 6 - "ParametersScreen.tsx"
Cohesion: 0.40
Nodes (5): DAY_LABELS, ParametersScreen(), styles, toInputs(), DEFAULT_KIND_TARGETS

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.07
Nodes (41): react-native-reanimated, BirthdayRecap, buildBirthdayRecap(), closingLine(), BirthdaySurprise(), CAKE_HINTS, GIFT_HINTS, Stage (+33 more)

### Community 10 - "@expo/vector-icons"
Cohesion: 0.22
Nodes (14): @expo/vector-icons, styles, Tile(), IconBtn(), ItemHead(), MenuEditScreen(), styles, ALL_MENU_IDS (+6 more)

### Community 11 - "ExpenseFormScreen.tsx"
Cohesion: 0.10
Nodes (23): @hookform/resolvers, react-hook-form, zod, FormValues, NavProp, RouteType, schema, styles (+15 more)

### Community 12 - "RADIUS"
Cohesion: 0.13
Nodes (14): ProgressBarProps, styles, Props, Reminder, styles, Props, Reminder, styles (+6 more)

### Community 13 - "theme/index.ts"
Cohesion: 0.14
Nodes (16): styles, GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, styles, ThemeScreen() (+8 more)

### Community 14 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (24): DebtNavigator(), GoalNavigator(), NotifPermissionBanner(), ReminderNavigator(), Stack, NavProp, ReminderItem(), ReminderListScreen() (+16 more)

### Community 15 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.14
Nodes (17): EmptyState(), AssetsNavigator(), Stack, CATEGORIES, Field(), fs, NavProp, Props (+9 more)

### Community 16 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.24
Nodes (12): PassiveIncomeNavigator(), Stack, categoryMeta(), PassiveIncomeListScreen(), PassiveIncomeStackParamList, styles, endOfMonth(), startOfMonth() (+4 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "palettes.ts"
Cohesion: 0.18
Nodes (10): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, peach, rose (+2 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.05
Nodes (95): Realm Models (10 total), dayjs, realm, @realm/react, migrateDebtsToV17(), NewExpense, OldDebt, OldPayment (+87 more)

### Community 22 - "AccountFormScreen.tsx"
Cohesion: 0.27
Nodes (9): AccountFormScreen(), Props, styles, ACCOUNT_PRESETS, ACCOUNT_TYPES, AccountType, deleteAccount(), getAccountBalances() (+1 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "package.json"
Cohesion: 0.08
Nodes (25): devDependencies, @types/react, typescript, main, name, private, scripts, android (+17 more)

### Community 25 - "formatCurrency"
Cohesion: 0.12
Nodes (35): react-native-safe-area-context, @react-navigation/native, @react-navigation/native-stack, AmountDisplay(), FAB(), lighten(), ProgressBar(), GoalsCard() (+27 more)

### Community 26 - "BackButton"
Cohesion: 0.14
Nodes (40): BackButton(), Button(), CurrencyInput(), formatThousands(), DateInput(), Input, InvestmentSuccessAnimation(), PurchaseToggle() (+32 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "DiagnosisScreen.tsx"
Cohesion: 0.18
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "AppProviders.tsx"
Cohesion: 0.13
Nodes (16): App(), expo, expo-status-bar, react-native-gesture-handler, AppInner(), AppProviders(), navigationRef, navTheme (+8 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.40
Nodes (4): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 34 - "Text"
Cohesion: 0.19
Nodes (21): AssetSuccessAnimation(), Coin(), MoneyDropAnimation(), SavingSuccessAnimation(), Text(), DayHeader(), dayLabel(), DaySection (+13 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "react"
Cohesion: 0.09
Nodes (29): react, AssetMoveKind, CONFIG, Props, BackButtonProps, styles, ButtonProps, styles (+21 more)

### Community 38 - "GroupedBarChart.tsx"
Cohesion: 0.40
Nodes (4): react-native-svg, GroupedBarChartProps, GroupedDataPoint, styles

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "NetWorthCard.tsx"
Cohesion: 0.40
Nodes (4): Props, styles, Summary, Trend()

### Community 42 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

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

### Community 50 - "MoneyDropAnimation.tsx"
Cohesion: 0.18
Nodes (10): COINS, MoneyDropMode, Props, styles, Props, SAVING_CONFIG, SavingMoveKind, CONFIG (+2 more)

### Community 52 - "ActivityScreen.tsx"
Cohesion: 0.11
Nodes (27): Props, styles, ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange() (+19 more)

### Community 53 - "ProfileScreen.tsx"
Cohesion: 0.10
Nodes (29): @react-navigation/bottom-tabs, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles (+21 more)

### Community 54 - "InvestmentListScreen.tsx"
Cohesion: 0.36
Nodes (7): InvestmentListScreen(), styles, SummaryCol(), TYPE_EMOJIS, TYPE_LABELS, calcProfitLoss(), calcROI()

### Community 56 - "InvestmentFormScreen.tsx"
Cohesion: 0.11
Nodes (17): CONFIG, InvestmentMoveKind, Props, InvestmentNavigator(), Stack, Props, styles, Field() (+9 more)

### Community 59 - "currency.ts"
Cohesion: 0.25
Nodes (12): Phase 1 — MVP (must have), GroupedBarChart(), CategoryBarList(), categoryBreakdown(), KindBarList(), kindBreakdown(), Mode, ReportScreen() (+4 more)

### Community 61 - "hashPin"
Cohesion: 0.50
Nodes (4): hashPin(), K, sha256(), utf8()

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 521 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AppLockGate.tsx`, `CategoriesScreen.tsx`, `Card`, `react-native`, `ParametersScreen.tsx`, `BirthdaySurprise.tsx`, `@expo/vector-icons`, `ExpenseFormScreen.tsx`, `RADIUS`, `theme/index.ts`, `RootNavigator.tsx`, `PhysicalAssetFormScreen.tsx`, `PassiveIncomeListScreen.tsx`, `DataScreen.tsx`, `AccountFormScreen.tsx`, `package.json`, `formatCurrency`, `BackButton`, `DiagnosisScreen.tsx`, `AppProviders.tsx`, `Text`, `GroupedBarChart.tsx`, `NetWorthCard.tsx`, `DateInput.tsx`, `MoneyDropAnimation.tsx`, `ActivityScreen.tsx`, `ProfileScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `currency.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `AppLockGate.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13008130081300814 - nodes in this community are weakly interconnected._
- **Why does `COLORS` connect `react` to `AppLockGate.tsx`, `CategoriesScreen.tsx`, `Card`, `react-native`, `ParametersScreen.tsx`, `BirthdaySurprise.tsx`, `@expo/vector-icons`, `ExpenseFormScreen.tsx`, `RADIUS`, `theme/index.ts`, `RootNavigator.tsx`, `PhysicalAssetFormScreen.tsx`, `PassiveIncomeListScreen.tsx`, `DataScreen.tsx`, `AccountFormScreen.tsx`, `formatCurrency`, `BackButton`, `DiagnosisScreen.tsx`, `AppProviders.tsx`, `Text`, `GroupedBarChart.tsx`, `NetWorthCard.tsx`, `DateInput.tsx`, `MoneyDropAnimation.tsx`, `ActivityScreen.tsx`, `ProfileScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `currency.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._