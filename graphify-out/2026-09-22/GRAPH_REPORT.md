# Graph Report - Dompetku  (2026-09-21)

## Corpus Check
- 161 files · ~133,690 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1033 nodes · 2805 edges · 81 communities (55 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8ed9cef7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DebtListScreen.tsx
- useDashboardData.ts
- prd-phase-3-local-financial-ai-assistant.md
- FinancialAdvisorService.ts
- SettingsNavigator.tsx
- DiagnosisScreen.tsx
- index.ts
- FONTS
- expo
- index.ts
- index.ts
- InvestmentListScreen.tsx
- SavingsDetailScreen.tsx
- COLORS
- PhysicalAssetListScreen.tsx
- GoalFormScreen.tsx
- RADIUS
- dependencies
- Project Context — Dompetku
- 9. Modules
- DebtFormScreen.tsx
- ExpenseListScreen.tsx
- motivation.ts
- dompetku-prd.md
- currency.ts
- IncomeListScreen.tsx
- ReportScreen.tsx
- NetWorthCard.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- PhysicalAssetListScreen.tsx
- 5. Technology Stack
- PassiveIncomeFormScreen.tsx
- date.ts
- 11. Data Models
- 12. Financial Calculations
- AchievementsScreen.tsx
- Financial Freedom Level System — Implementation Plan
- 10. Dashboard Widgets
- CashScreen.tsx
- FAB.tsx
- Income Module
- Settings Module
- FAB.tsx
- expo-background-task
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- expo
- expo-dev-client
- AmountDisplay.tsx
- expo-linear-gradient
- expo-notifications
- babel-preset-expo
- NetWorthPoint
- FAB.tsx
- @expo/vector-icons
- @hookform/resolvers
- babel-preset-expo
- react-hook-form
- react-native-mmkv
- react-native-safe-area-context
- react-native-screens
- react-native-svg
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-navigation/native-stack
- @realm/react
- zod
- zustand
- CLAUDE.md
- IncomeFormScreen.tsx
- expo-file-system
- react-native
- victory-native
- expo-background-task
- CurrencyInput.tsx

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 84 edges
2. `FONTS` - 75 edges
3. `SPACING` - 72 edges
4. `RADIUS` - 58 edges
5. `formatCurrency()` - 54 edges
6. `formatCompact()` - 43 edges
7. `Card()` - 39 edges
8. `Text()` - 39 edges
9. `SavingModel` - 35 edges
10. `useDashboardData()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `DebtListScreen()` --references--> `react`  [EXTRACTED]
  src/modules/debt/screens/DebtListScreen.tsx → package.json
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `saveFinancialScoreSnapshot()` --references--> `realm`  [EXTRACTED]
  src/services/FinancialScoreService.ts → package.json
- `runPassiveIncomeSchedule()` --references--> `realm`  [EXTRACTED]
  src/services/PassiveIncomeScheduler.ts → package.json
- `applyDebtPaymentFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json

## Import Cycles
- None detected.

## Communities (81 total, 26 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.18
Nodes (11): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen(), CategoryType (+3 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.06
Nodes (43): CardProps, styles, PassiveIncomeModel, Props, Props, Stack, NavProp, PassiveIncomeFormScreen() (+35 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.06
Nodes (62): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+54 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.10
Nodes (21): ProgressBarProps, styles, AiDetailModal(), styles, EmergencyFundCard(), styles, HealthBadges(), Props (+13 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.50
Nodes (4): CATEGORY_ICON, categoryTitle(), MotivationCard(), styles

### Community 6 - "index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 7 - "FONTS"
Cohesion: 0.14
Nodes (15): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, useCashflowChart(), Cashflow12mCard(), Props, styles (+7 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+15 more)

### Community 9 - "index.ts"
Cohesion: 0.07
Nodes (67): realm, realm, DebtPaymentKind, ChartPeriod, CategoryModel, DebtModel, DebtPaymentModel, ExpenseModel (+59 more)

### Community 10 - "index.ts"
Cohesion: 0.22
Nodes (13): EmergencyPickerModal(), NeracaRow(), PaymentItem(), ScheduleItem(), CashItem(), ExpenseItem(), IncomeItem(), NavProp (+5 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.11
Nodes (22): AssetMoveKind, CONFIG, Props, DebtPaymentSuccessAnimation(), Props, TITLE, CONFIG, InvestmentMoveKind (+14 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.25
Nodes (8): AchievementsScreen(), NavProp, Props, styles, AchievementCheckInput, ACHIEVEMENT_DEFS, AchievementDef, AchievementType

### Community 13 - "COLORS"
Cohesion: 0.19
Nodes (13): DebtType, Category, CATEGORY_OPTIONS, categoryOf(), DEBT_TYPES, DebtFormScreen(), FormValues, HAS_DUE_DATE (+5 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.19
Nodes (11): CategoryFormScreen(), EMOJI_OPTIONS, Props, styles, LEVEL_EXAMPLES, LevelGuideScreen(), NavProp, Props (+3 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.21
Nodes (12): Stack, ModalType, Props, SavingsDetailScreen(), styles, TYPE_COLOR, TYPE_LABEL, Props (+4 more)

### Community 16 - "RADIUS"
Cohesion: 0.12
Nodes (25): Card(), ProgressBar(), DebtRatioCard(), Props, styles, FinancialInsightsCard(), SEVERITY_COLOR, styles (+17 more)

### Community 17 - "dependencies"
Cohesion: 0.13
Nodes (15): dayjs, expo-dev-client, expo-document-picker, dependencies, dayjs, expo-dev-client, expo-document-picker, react (+7 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.13
Nodes (14): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+6 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DebtFormScreen.tsx"
Cohesion: 0.05
Nodes (44): App(), plugins, expo-background-task, expo-sharing, AppInner(), AppProviders(), styles, ErrorBoundary (+36 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.22
Nodes (7): EmptyState(), EmptyStateProps, styles, CATEGORY_EMOJIS, CATEGORY_LABELS, PhysicalAssetListScreen(), styles

### Community 22 - "motivation.ts"
Cohesion: 0.17
Nodes (17): buildQuotes(), CategorySource, getBank(), getQuotesForCategory(), getRandomQuote(), QUOTE_CATEGORY_LABEL, QuoteCategory, SOURCES (+9 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "currency.ts"
Cohesion: 0.20
Nodes (11): DebtDetailScreen(), NavProp, PaymentItemProps, RouteType, SCHEDULE_STATUS_META, ScheduleItemProps, styles, isOverdue() (+3 more)

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.15
Nodes (10): DashboardScreen(), InvestmentNavigator(), SavingsNavigator(), SettingsNavigator(), FinanceTabNavigator(), ROUTE_EMOJI, styles, Tab (+2 more)

### Community 26 - "ReportScreen.tsx"
Cohesion: 0.15
Nodes (11): ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryOption, EXPENSE_EMOJIS, INCOME_EMOJIS, MonthOption, NavProp (+3 more)

### Community 27 - "NetWorthCard.tsx"
Cohesion: 0.33
Nodes (5): NetWorthCard(), Props, styles, Summary, DashboardData

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.20
Nodes (9): main, name, private, scripts, android, ios, start, web (+1 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.20
Nodes (9): expo/tsconfig.base, .expo/types/**/*.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths, strict, extends (+1 more)

### Community 31 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.15
Nodes (13): BackButton(), BackButtonProps, styles, Button(), ButtonProps, styles, EMOJI_OPTIONS, Props (+5 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.18
Nodes (10): CurrencyInput(), CurrencyInputProps, formatThousands(), styles, fieldStyles, INVESTMENT_TYPES, NavProp, Props (+2 more)

### Community 34 - "date.ts"
Cohesion: 0.14
Nodes (14): AssetSuccessAnimation(), AssetsNavigator(), Stack, CATEGORIES, fs, NavProp, PhysicalAssetFormScreen(), Props (+6 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "AchievementsScreen.tsx"
Cohesion: 0.29
Nodes (7): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "CashScreen.tsx"
Cohesion: 0.22
Nodes (8): Props, Reminder, RemindersModal(), styles, Props, Reminder, RemindersSection(), styles

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "FAB.tsx"
Cohesion: 0.12
Nodes (17): Text(), TextProps, variantStyles, weightMap, styles, FreedomCard(), Props, styles (+9 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 52 - "AmountDisplay.tsx"
Cohesion: 0.40
Nodes (4): AmountDisplay(), AmountDisplayProps, sizes, styles

### Community 56 - "NetWorthPoint"
Cohesion: 0.17
Nodes (18): InvestmentSuccessAnimation(), InvestmentModel, Stack, InvestmentDividendScreen(), Props, styles, InvestmentFormScreen(), InvestmentListScreen() (+10 more)

### Community 57 - "FAB.tsx"
Cohesion: 0.50
Nodes (4): FAB(), lighten(), Props, styles

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 75 - "IncomeFormScreen.tsx"
Cohesion: 0.12
Nodes (20): TransactionSuccessAnimation(), CATEGORIES, ExpenseFormScreen(), FormValues, NavProp, RouteType, schema, styles (+12 more)

### Community 84 - "CurrencyInput.tsx"
Cohesion: 0.10
Nodes (16): DonutChartProps, Segment, styles, DataPoint, SimpleBarChartProps, styles, InputProps, styles (+8 more)

## Knowledge Gaps
- **468 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+463 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `index.ts`, `package.json`, `FAB.tsx`, `expo-background-task`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `babel-preset-expo`, `@expo/vector-icons`, `@hookform/resolvers`, `babel-preset-expo`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-file-system`, `react-native`, `victory-native`, `expo-background-task`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `realm` connect `index.ts` to `dependencies`, `FinancialAdvisorService.ts`, `useDashboardData.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `COLORS` connect `InvestmentListScreen.tsx` to `DebtListScreen.tsx`, `useDashboardData.ts`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `FONTS`, `index.ts`, `index.ts`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `ReportScreen.tsx`, `NetWorthCard.tsx`, `PhysicalAssetListScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `date.ts`, `AchievementsScreen.tsx`, `CashScreen.tsx`, `FAB.tsx`, `AmountDisplay.tsx`, `NetWorthPoint`, `IncomeFormScreen.tsx`, `CurrencyInput.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _468 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `FinancialAdvisorService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06327006327006326 - nodes in this community are weakly interconnected._