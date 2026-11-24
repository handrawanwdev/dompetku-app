# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 166 files · ~199,566 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1091 nodes · 3853 edges · 62 communities (57 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24ac33cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- realm.ts
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- react
- Button
- Card
- SPEC — ForgeOS Project
- expo
- MenuEditScreen.tsx
- ProfileScreen.tsx
- DebtDetailScreen.tsx
- ActivityScreen.tsx
- common/index.ts
- theme/index.ts
- AppLockGate.tsx
- ReportScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- DataScreen.tsx
- AppProviders.tsx
- dompetku-prd.md
- AccountDetailScreen.tsx
- formatCurrency
- GoalFormScreen.tsx
- ExpenseFormScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- DebtReminderBackgroundTask.ts
- 5. Technology Stack
- PassiveIncomeListScreen.tsx
- Text
- 11. Data Models
- 12. Financial Calculations
- constants/index.ts
- InvestmentListScreen.tsx
- 10. Dashboard Widgets
- PhysicalAssetFormScreen.tsx
- budget.ts
- SPACING
- Income Module
- Settings Module
- palettes.ts
- InvestmentFormScreen.tsx
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- @react-navigation/native-stack
- ReminderScheduler.ts
- Financial Freedom Level System — Implementation Plan
- CategoriesScreen.tsx
- scripts
- @expo/vector-icons
- NetWorthCard.tsx
- CurrencyInput.tsx
- Button.tsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 99 edges
2. `react` - 94 edges
3. `COLORS` - 87 edges
4. `react-native` - 78 edges
5. `FONTS` - 69 edges
6. `SPACING` - 67 edges
7. `formatCurrency()` - 66 edges
8. `RADIUS` - 63 edges
9. `@expo/vector-icons` - 52 edges
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

## Communities (62 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "realm.ts"
Cohesion: 0.19
Nodes (13): migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig, ALL_MODELS, DataScreen(), Row() (+5 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.11
Nodes (17): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+9 more)

### Community 4 - "react"
Cohesion: 0.08
Nodes (37): react, react-native, react-native-svg, GroupedBarChartProps, GroupedDataPoint, styles, AmountDisplayProps, sizes (+29 more)

### Community 5 - "Button"
Cohesion: 0.20
Nodes (20): Button(), CurrencyInput(), CONFIG, InvestmentMoveKind, InvestmentSuccessAnimation(), Props, PhysicalAssetSellScreen(), IncomeFormScreen() (+12 more)

### Community 6 - "Card"
Cohesion: 0.14
Nodes (30): Card(), BirthdayCard(), BudgetSplitCard(), styles, CashflowCalendarCard(), DayEntry, short(), Stat() (+22 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "MenuEditScreen.tsx"
Cohesion: 0.23
Nodes (13): styles, Tile(), IconBtn(), ItemHead(), MenuEditScreen(), styles, ALL_MENU_IDS, DEFAULT_MENU (+5 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.08
Nodes (34): dayjs, @react-navigation/bottom-tabs, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar() (+26 more)

### Community 11 - "DebtDetailScreen.tsx"
Cohesion: 0.27
Nodes (9): DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtStackParamList, useDebts() (+1 more)

### Community 12 - "ActivityScreen.tsx"
Cohesion: 0.17
Nodes (15): ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS, Props (+7 more)

### Community 13 - "common/index.ts"
Cohesion: 0.19
Nodes (14): Coin(), COINS, MoneyDropAnimation(), MoneyDropMode, Props, styles, Props, SAVING_CONFIG (+6 more)

### Community 14 - "theme/index.ts"
Cohesion: 0.16
Nodes (13): GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, styles, ThemeScreen(), setThemeId() (+5 more)

### Community 15 - "AppLockGate.tsx"
Cohesion: 0.10
Nodes (46): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), KEYS, PinPad() (+38 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.32
Nodes (11): Phase 1 — MVP (must have), GroupedBarChart(), CategoryBarList(), categoryBreakdown(), KindBarList(), kindBreakdown(), Mode, ReportScreen() (+3 more)

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
Cohesion: 0.18
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.09
Nodes (55): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel (+47 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.18
Nodes (11): AppInner(), AppProviders(), navigationRef, navTheme, styles, useOpenFromNotification(), ErrorBoundary, RootNavigator() (+3 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "AccountDetailScreen.tsx"
Cohesion: 0.16
Nodes (20): AccountPicker(), Props, styles, AccountDetailScreen(), Action(), Props, Row, styles (+12 more)

### Community 25 - "formatCurrency"
Cohesion: 0.18
Nodes (24): BackButton(), EmptyState(), FAB(), lighten(), ProgressBar(), DetailItem(), PhysicalAssetListScreen(), GoalsCard() (+16 more)

### Community 26 - "GoalFormScreen.tsx"
Cohesion: 0.17
Nodes (17): ExpenseFormScreen(), Stack, GoalFormScreen(), Props, styles, toNumber(), GoalStackParamList, buildGoalInfo() (+9 more)

### Community 27 - "ExpenseFormScreen.tsx"
Cohesion: 0.06
Nodes (52): @hookform/resolvers, react-hook-form, @react-navigation/native, zod, Input, ReminderModel, ReminderRepeat, FormValues (+44 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.09
Nodes (23): App(), devDependencies, @types/react, typescript, main, name, private, version (+15 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.14
Nodes (13): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, LEGACY_TASK_NAMES, storage, StorageKeys, buildDebtInfos() (+5 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.14
Nodes (10): categoryMeta(), PassiveIncomeListScreen(), styles, endOfMonth(), startOfMonth(), getPassiveIncomeStatus(), PASSIVE_INCOME_CATEGORIES, PASSIVE_INCOME_FREQUENCIES (+2 more)

### Community 34 - "Text"
Cohesion: 0.21
Nodes (16): AmountDisplay(), Text(), NotifPermissionBanner(), ReminderItem(), ReminderListScreen(), ActiveTab, buildMonthOptions(), CashflowScreen() (+8 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "constants/index.ts"
Cohesion: 0.18
Nodes (10): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, Props, AssetCategory (+2 more)

### Community 38 - "InvestmentListScreen.tsx"
Cohesion: 0.33
Nodes (8): InvestmentListScreen(), styles, SummaryCol(), TYPE_EMOJIS, TYPE_LABELS, formatDate(), calcProfitLoss(), calcROI()

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.12
Nodes (21): react-native-safe-area-context, AssetMoveKind, AssetSuccessAnimation(), CONFIG, Props, PurchaseToggle(), AssetsNavigator(), Stack (+13 more)

### Community 41 - "budget.ts"
Cohesion: 0.19
Nodes (16): DAY_LABELS, ParametersScreen(), styles, toInputs(), saveSettings(), DEFAULT_SETTINGS, useSettingsStore, validTargets() (+8 more)

### Community 42 - "SPACING"
Cohesion: 0.17
Nodes (13): Props, Reminder, styles, Props, Reminder, styles, amountText(), Props (+5 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "palettes.ts"
Cohesion: 0.18
Nodes (10): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, peach, rose (+2 more)

### Community 46 - "InvestmentFormScreen.tsx"
Cohesion: 0.13
Nodes (15): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE, Field() (+7 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "@react-navigation/native-stack"
Cohesion: 0.24
Nodes (9): @react-navigation/native-stack, PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles (+1 more)

### Community 51 - "ReminderScheduler.ts"
Cohesion: 0.26
Nodes (17): BillReminderInput, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBillReminders(), refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders() (+9 more)

### Community 52 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.40
Nodes (4): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 53 - "CategoriesScreen.tsx"
Cohesion: 0.47
Nodes (5): CategoriesScreen(), CategoryType, styles, ensureDefaultExpenseCategories(), isSpendKind()

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 55 - "@expo/vector-icons"
Cohesion: 0.19
Nodes (9): @expo/vector-icons, BackButtonProps, styles, styles, styles, Props, styles, styles (+1 more)

### Community 56 - "NetWorthCard.tsx"
Cohesion: 0.40
Nodes (4): Props, styles, Summary, Trend()

### Community 57 - "CurrencyInput.tsx"
Cohesion: 0.50
Nodes (3): CurrencyInputProps, formatThousands(), styles

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 502 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Button`, `Card`, `MenuEditScreen.tsx`, `ProfileScreen.tsx`, `DebtDetailScreen.tsx`, `ActivityScreen.tsx`, `common/index.ts`, `theme/index.ts`, `AppLockGate.tsx`, `ReportScreen.tsx`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `AccountDetailScreen.tsx`, `formatCurrency`, `GoalFormScreen.tsx`, `ExpenseFormScreen.tsx`, `package.json`, `PassiveIncomeListScreen.tsx`, `Text`, `InvestmentListScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `budget.ts`, `SPACING`, `InvestmentFormScreen.tsx`, `@react-navigation/native-stack`, `CategoriesScreen.tsx`, `@expo/vector-icons`, `NetWorthCard.tsx`, `CurrencyInput.tsx`, `Button.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `COLORS` connect `react` to `Button`, `Card`, `MenuEditScreen.tsx`, `ProfileScreen.tsx`, `DebtDetailScreen.tsx`, `ActivityScreen.tsx`, `common/index.ts`, `theme/index.ts`, `AppLockGate.tsx`, `ReportScreen.tsx`, `DiagnosisScreen.tsx`, `DataScreen.tsx`, `AppProviders.tsx`, `AccountDetailScreen.tsx`, `formatCurrency`, `GoalFormScreen.tsx`, `ExpenseFormScreen.tsx`, `DebtReminderBackgroundTask.ts`, `PassiveIncomeListScreen.tsx`, `Text`, `InvestmentListScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `budget.ts`, `SPACING`, `InvestmentFormScreen.tsx`, `@react-navigation/native-stack`, `CategoriesScreen.tsx`, `@expo/vector-icons`, `NetWorthCard.tsx`, `CurrencyInput.tsx`, `Button.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._