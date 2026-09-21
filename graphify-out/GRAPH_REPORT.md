# Graph Report - Dompetku  (2026-09-21)

## Corpus Check
- 155 files · ~131,116 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 995 nodes · 2707 edges · 81 communities (53 shown, 28 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3e412f6d`
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
- CashflowScreen.tsx
- dompetku-prd.md
- currency.ts
- IncomeListScreen.tsx
- DebtDetailScreen.tsx
- PassiveIncomeFormScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- formatCurrency
- 5. Technology Stack
- CashflowScreen.tsx
- 11. Data Models
- 12. Financial Calculations
- DonutChart.tsx
- Financial Freedom Level System — Implementation Plan
- 10. Dashboard Widgets
- expo-sharing
- scripts
- FAB.tsx
- Income Module
- Settings Module
- SettingsNavigator.tsx
- expo-background-task
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- expo
- expo-dev-client
- NetWorthPoint
- expo-linear-gradient
- expo-notifications
- babel-preset-expo
- @expo/vector-icons
- @hookform/resolvers
- Props
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
- expo-task-manager
- react-native
- victory-native
- ReportScreen.tsx
- CurrencyInput.tsx
- babel-preset-expo

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 78 edges
2. `FONTS` - 74 edges
3. `SPACING` - 71 edges
4. `RADIUS` - 56 edges
5. `formatCurrency()` - 52 edges
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
- `getKasBebasBalance()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `routeSaleProceeds()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `clearAllData()` --references--> `realm`  [EXTRACTED]
  src/services/DevSeeder.ts → package.json

## Import Cycles
- None detected.

## Communities (81 total, 28 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.20
Nodes (11): DebtDetailScreen(), NavProp, PaymentItemProps, RouteType, SCHEDULE_STATUS_META, ScheduleItemProps, styles, isOverdue() (+3 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.09
Nodes (18): DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, DebtTypeForReminder, EmergencyFundStatus, FinancialProjection, FinancialSuggestionCard, FireInfo (+10 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.11
Nodes (32): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+24 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.08
Nodes (30): App(), AppInner(), AppProviders(), styles, ErrorBoundary, DiagnosisScreen(), SOURCE_LABEL, styles (+22 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.19
Nodes (13): DebtType, Category, CATEGORY_OPTIONS, categoryOf(), DEBT_TYPES, DebtFormScreen(), FormValues, HAS_DUE_DATE (+5 more)

### Community 6 - "index.ts"
Cohesion: 0.07
Nodes (30): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, getSettings(), saveSettings() (+22 more)

### Community 7 - "FONTS"
Cohesion: 0.08
Nodes (28): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, Card(), Text(), TextProps, variantStyles (+20 more)

### Community 8 - "expo"
Cohesion: 0.07
Nodes (26): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+18 more)

### Community 9 - "index.ts"
Cohesion: 0.06
Nodes (73): expo-background-task, realmConfig, ChartPeriod, useCashflowChart(), CategoryModel, DebtModel, DebtPaymentModel, ExpenseModel (+65 more)

### Community 10 - "index.ts"
Cohesion: 0.17
Nodes (15): EmptyState(), EmptyStateProps, styles, Stack, ModalType, Props, SavingsDetailScreen(), styles (+7 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.21
Nodes (15): realm, realm, SavingHistoryModel, MoveType, Props, SavingsMoveScreen(), styles, applyDebtPaymentFunding() (+7 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.22
Nodes (8): AssetsNavigator(), Stack, PhysicalAssetFormScreen(), AssetsStackParamList, CATEGORY_EMOJIS, CATEGORY_LABELS, PhysicalAssetListScreen(), styles

### Community 13 - "COLORS"
Cohesion: 0.18
Nodes (9): DebtNavigator(), Stack, DebtStackParamList, SavingsNavigator(), FinanceTabNavigator(), ROUTE_EMOJI, styles, Tab (+1 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.09
Nodes (24): AchievementsScreen(), NavProp, Props, styles, CategoriesScreen(), CategoryFormScreen(), EMOJI_OPTIONS, Props (+16 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.21
Nodes (11): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, categoryMeta() (+3 more)

### Community 16 - "RADIUS"
Cohesion: 0.08
Nodes (31): FinancialInsightsCard(), FreedomCard(), Props, styles, ChecklistItem, LevelDetailModal(), Props, styles (+23 more)

### Community 17 - "dependencies"
Cohesion: 0.13
Nodes (15): babel-preset-expo, dayjs, expo-document-picker, dependencies, babel-preset-expo, dayjs, expo-document-picker, react (+7 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.13
Nodes (14): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+6 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DebtFormScreen.tsx"
Cohesion: 0.17
Nodes (17): buildQuotes(), CategorySource, getBank(), getQuotesForCategory(), getRandomQuote(), QUOTE_CATEGORY_LABEL, QuoteCategory, SOURCES (+9 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.33
Nodes (5): CategoryBarList(), categoryBreakdown(), Mode, ReportScreen(), styles

### Community 22 - "CashflowScreen.tsx"
Cohesion: 0.18
Nodes (16): EmergencyPickerModal(), NeracaRow(), PaymentItem(), ScheduleItem(), DebtItem(), CashItem(), BreakdownRow(), ExpenseItem() (+8 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "currency.ts"
Cohesion: 0.29
Nodes (7): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.13
Nodes (16): InvestmentNavigator(), Stack, fieldStyles, INVESTMENT_TYPES, InvestmentFormScreen(), NavProp, Props, RoutePropT (+8 more)

### Community 26 - "DebtDetailScreen.tsx"
Cohesion: 0.25
Nodes (6): CATEGORIES, fs, NavProp, Props, RoutePropT, styles

### Community 27 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.40
Nodes (3): DonutChartProps, Segment, styles

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.20
Nodes (9): main, name, private, scripts, android, ios, start, web (+1 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.20
Nodes (9): expo/tsconfig.base, .expo/types/**/*.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths, strict, extends (+1 more)

### Community 31 - "formatCurrency"
Cohesion: 0.19
Nodes (18): BackButton(), Button(), SavingModel, PhysicalAssetSellScreen(), Props, styles, Props, DebtPaymentScreen() (+10 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "CashflowScreen.tsx"
Cohesion: 0.15
Nodes (11): ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryOption, EXPENSE_EMOJIS, INCOME_EMOJIS, MonthOption, NavProp (+3 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "DonutChart.tsx"
Cohesion: 0.40
Nodes (4): AmountDisplay(), AmountDisplayProps, sizes, styles

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "expo-sharing"
Cohesion: 0.40
Nodes (5): getKewajibanBulanIni(), getWorkingDaysInMonth(), getWorkingDaysRemaining(), isMonthlyObligation(), isMonthlyObligationNextMonth()

### Community 41 - "scripts"
Cohesion: 0.11
Nodes (17): DataPoint, SimpleBarChartProps, styles, AiDetailModal(), styles, GoalProgressCard(), Props, styles (+9 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "SettingsNavigator.tsx"
Cohesion: 0.19
Nodes (10): FAB(), lighten(), Props, styles, ProgressBar(), ProgressBarProps, styles, DebtRatioCard() (+2 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 75 - "IncomeFormScreen.tsx"
Cohesion: 0.11
Nodes (19): CurrencyInput(), formatThousands(), CATEGORIES, ExpenseFormScreen(), FormValues, NavProp, RouteType, schema (+11 more)

### Community 80 - "ReportScreen.tsx"
Cohesion: 0.18
Nodes (9): NetWorthCard(), Props, styles, Summary, styles, Summary, SummaryGrid(), SummaryItem() (+1 more)

### Community 84 - "CurrencyInput.tsx"
Cohesion: 0.09
Nodes (30): BackButtonProps, styles, ButtonProps, styles, CardProps, styles, CurrencyInputProps, styles (+22 more)

## Knowledge Gaps
- **449 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+444 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `InvestmentListScreen.tsx`, `package.json`, `FAB.tsx`, `expo-background-task`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `babel-preset-expo`, `@expo/vector-icons`, `@hookform/resolvers`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-file-system`, `expo-task-manager`, `react-native`, `victory-native`, `babel-preset-expo`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `realm` connect `InvestmentListScreen.tsx` to `dependencies`, `PhysicalAssetListScreen.tsx`, `index.ts`, `formatCurrency`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `COLORS` connect `CurrencyInput.tsx` to `DebtListScreen.tsx`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `FONTS`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `CashflowScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `DebtDetailScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `formatCurrency`, `CashflowScreen.tsx`, `DonutChart.tsx`, `scripts`, `SettingsNavigator.tsx`, `IncomeFormScreen.tsx`, `ReportScreen.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `FinancialAdvisorService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11295681063122924 - nodes in this community are weakly interconnected._