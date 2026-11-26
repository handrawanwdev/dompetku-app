# Graph Report - Dompetku  (2026-11-27)

## Corpus Check
- 178 files · ~207,845 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1169 nodes · 4189 edges · 60 communities (56 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `541b11e2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- AppProviders.tsx
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- Text
- common/index.ts
- settingsStore.ts
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- MenuEditScreen.tsx
- DataScreen.tsx
- react
- react-native
- ExpenseFormScreen.tsx
- theme/index.ts
- BirthdayLetter.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- palettes.ts
- DevSeeder.ts
- AccountService.ts
- dompetku-prd.md
- package.json
- GoalDetailScreen.tsx
- BackButton
- react-native-safe-area-context
- Build Lokal — Android SDK Required
- SettingsScreen.tsx
- tsconfig.json
- Card.tsx
- 5. Technology Stack
- constants/index.ts
- CashflowScreen.tsx
- 11. Data Models
- 12. Financial Calculations
- formatCurrency
- DateInput.tsx
- 10. Dashboard Widgets
- RootNavigator.tsx
- useDashboardData.ts
- scripts
- Income Module
- Settings Module
- realm
- DebtDetailScreen.tsx
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- COLORS
- ErrorBoundary.tsx
- ActivityScreen.tsx
- devDependencies
- InvestmentListScreen.tsx
- InvestmentFormScreen.tsx
- ReportScreen.tsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 106 edges
2. `react` - 104 edges
3. `COLORS` - 96 edges
4. `react-native` - 87 edges
5. `FONTS` - 75 edges
6. `SPACING` - 74 edges
7. `RADIUS` - 70 edges
8. `formatCurrency()` - 69 edges
9. `@expo/vector-icons` - 57 edges
10. `BackButton()` - 50 edges

## Surprising Connections (you probably didn't know these)
- `Realm Models (10 total)` --references--> `IncomeModel`  [INFERRED]
  docs/project-context.md → src/models/IncomeModel.ts
- `Realm Models (10 total)` --references--> `InvestmentModel`  [INFERRED]
  docs/project-context.md → src/models/InvestmentModel.ts
- `Phase 1 — MVP (must have)` --references--> `DashboardScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/dashboard/DashboardScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx

## Import Cycles
- None detected.

## Communities (60 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "AppProviders.tsx"
Cohesion: 0.05
Nodes (76): App(), expo, expo-status-bar, react-native-gesture-handler, AppLockGate(), formatWait(), LockScreen(), Mode (+68 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "Text"
Cohesion: 0.06
Nodes (72): dayjs, @react-navigation/bottom-tabs, Card(), Text(), BirthdayCard(), BudgetSplitCard(), CashflowCalendarCard(), DayEntry (+64 more)

### Community 5 - "common/index.ts"
Cohesion: 0.13
Nodes (14): expo-linear-gradient, AmountDisplay(), AmountDisplayProps, sizes, styles, Props, styles, TextProps (+6 more)

### Community 6 - "settingsStore.ts"
Cohesion: 0.22
Nodes (12): DAY_LABELS, ParametersScreen(), styles, toInputs(), DEFAULT_SETTINGS, SettingsState, validTargets(), AppSettings (+4 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.10
Nodes (28): react-native-reanimated, zustand, BirthdaySurprise(), CAKE_HINTS, GIFT_HINTS, Stage, styles, useBirthdaySurprise (+20 more)

### Community 10 - "MenuEditScreen.tsx"
Cohesion: 0.27
Nodes (11): IconBtn(), ItemHead(), MenuEditScreen(), styles, ALL_MENU_IDS, DEFAULT_MENU, MENU_ITEMS, MenuId (+3 more)

### Community 11 - "DataScreen.tsx"
Cohesion: 0.18
Nodes (16): @realm/react, CategoryFormScreen(), EMOJI_OPTIONS, Props, styles, DataScreen(), Row(), styles (+8 more)

### Community 12 - "react"
Cohesion: 0.14
Nodes (13): react, ProgressBarProps, styles, Props, Reminder, styles, Props, Reminder (+5 more)

### Community 13 - "react-native"
Cohesion: 0.10
Nodes (35): @expo/vector-icons, react-native, EmptyStateProps, styles, InputProps, styles, Props, styles (+27 more)

### Community 14 - "ExpenseFormScreen.tsx"
Cohesion: 0.07
Nodes (46): @hookform/resolvers, react-hook-form, @react-navigation/native, zod, ReminderModel, ReminderRepeat, Props, FormValues (+38 more)

### Community 15 - "theme/index.ts"
Cohesion: 0.24
Nodes (8): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, PALETTES, ThemeId

### Community 16 - "BirthdayLetter.tsx"
Cohesion: 0.31
Nodes (9): BirthdayRecap, closingLine(), BirthdayLetter(), Icon, Props, stats(), styles, BirthdayCelebration (+1 more)

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

### Community 21 - "DevSeeder.ts"
Cohesion: 0.43
Nodes (7): ensureDefaultExpenseCategories(), dateDaysAgo(), INCOME_CATEGORIES, pick(), randInt(), seedDummyData(), SPEND_ROWS

### Community 22 - "AccountService.ts"
Cohesion: 0.21
Nodes (16): AccountModel, AccountFormScreen(), Props, styles, AccountInfo, ACCOUNT_PRESETS, ACCOUNT_TYPES, accountLabel() (+8 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "package.json"
Cohesion: 0.12
Nodes (15): main, name, private, version, babel-preset-expo, expo-dev-client, expo-document-picker, expo-file-system (+7 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.24
Nodes (13): EmptyState(), Stack, GoalDetailScreen(), Props, Row(), styles, GoalItem(), GoalListScreen() (+5 more)

### Community 26 - "BackButton"
Cohesion: 0.20
Nodes (29): BackButton(), Button(), CurrencyInput(), DateInput(), Input, DebtFormScreen(), Props, styles (+21 more)

### Community 27 - "react-native-safe-area-context"
Cohesion: 0.10
Nodes (18): react-native-safe-area-context, PassiveIncomeNavigator(), Stack, NavProp, Props, RoutePropT, styles, categoryMeta() (+10 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "SettingsScreen.tsx"
Cohesion: 0.27
Nodes (8): NotifPermissionBanner(), GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, isNotifOn(), NotifSettingKey

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "Card.tsx"
Cohesion: 0.28
Nodes (7): CardProps, styles, DevToolsScreen(), MenuItem(), styles, clearAllData(), SeedSummary

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "constants/index.ts"
Cohesion: 0.22
Nodes (8): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, AssetCategory, InvestmentType

### Community 34 - "CashflowScreen.tsx"
Cohesion: 0.13
Nodes (24): DayHeader(), DaySection, groupByDate(), TxRow(), AccountDetailScreen(), Action(), Props, Row (+16 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "formatCurrency"
Cohesion: 0.17
Nodes (20): FAB(), lighten(), Stack, AssetsStackParamList, CATEGORY_EMOJIS, CATEGORY_LABELS, DetailItem(), PhysicalAssetListScreen() (+12 more)

### Community 38 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "RootNavigator.tsx"
Cohesion: 0.29
Nodes (6): AssetsNavigator(), DebtNavigator(), GoalNavigator(), InvestmentNavigator(), SHOW_INVESTMENT_AND_ASSETS, Stack

### Community 41 - "useDashboardData.ts"
Cohesion: 0.23
Nodes (13): IncomeModel, InvestmentModel, PassiveIncomeModel, TransferModel, useDashboardData(), FreedomLevelData, getBalances(), getMarkedSavings() (+5 more)

### Community 42 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "realm"
Cohesion: 0.21
Nodes (14): Realm Models (10 total), realm, CategoryModel, DebtModel, ExpenseModel, GoalModel, PhysicalAssetModel, buildGoalInfo() (+6 more)

### Community 46 - "DebtDetailScreen.tsx"
Cohesion: 0.07
Nodes (54): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, ProgressBar(), migrateDebtsToV17(), NewExpense, OldDebt (+46 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "COLORS"
Cohesion: 0.12
Nodes (21): AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, Coin(), COINS (+13 more)

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.50
Nodes (3): Props, State, styles

### Community 52 - "ActivityScreen.tsx"
Cohesion: 0.17
Nodes (15): ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS, Props (+7 more)

### Community 53 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, @types/react, typescript

### Community 54 - "InvestmentListScreen.tsx"
Cohesion: 0.16
Nodes (16): @react-navigation/native-stack, BackButtonProps, styles, InvestmentSuccessAnimation(), Stack, InvestmentDividendScreen(), Props, styles (+8 more)

### Community 56 - "InvestmentFormScreen.tsx"
Cohesion: 0.10
Nodes (25): AssetSuccessAnimation(), ButtonProps, styles, CurrencyInputProps, formatThousands(), styles, PurchaseToggle(), CATEGORIES (+17 more)

### Community 59 - "ReportScreen.tsx"
Cohesion: 0.08
Nodes (34): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+26 more)

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 530 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `AppProviders.tsx`, `Text`, `common/index.ts`, `settingsStore.ts`, `BirthdaySurprise.tsx`, `MenuEditScreen.tsx`, `DataScreen.tsx`, `react-native`, `ExpenseFormScreen.tsx`, `theme/index.ts`, `BirthdayLetter.tsx`, `AccountService.ts`, `package.json`, `GoalDetailScreen.tsx`, `BackButton`, `react-native-safe-area-context`, `SettingsScreen.tsx`, `Card.tsx`, `CashflowScreen.tsx`, `formatCurrency`, `DateInput.tsx`, `RootNavigator.tsx`, `useDashboardData.ts`, `realm`, `DebtDetailScreen.tsx`, `COLORS`, `ErrorBoundary.tsx`, `ActivityScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `ReportScreen.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `AppProviders.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.050883898709985664 - nodes in this community are weakly interconnected._
- **Why does `COLORS` connect `COLORS` to `AppProviders.tsx`, `Text`, `common/index.ts`, `settingsStore.ts`, `BirthdaySurprise.tsx`, `MenuEditScreen.tsx`, `DataScreen.tsx`, `react`, `react-native`, `ExpenseFormScreen.tsx`, `theme/index.ts`, `BirthdayLetter.tsx`, `AccountService.ts`, `GoalDetailScreen.tsx`, `BackButton`, `react-native-safe-area-context`, `SettingsScreen.tsx`, `Card.tsx`, `CashflowScreen.tsx`, `formatCurrency`, `DateInput.tsx`, `RootNavigator.tsx`, `realm`, `DebtDetailScreen.tsx`, `ErrorBoundary.tsx`, `ActivityScreen.tsx`, `InvestmentListScreen.tsx`, `InvestmentFormScreen.tsx`, `ReportScreen.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._