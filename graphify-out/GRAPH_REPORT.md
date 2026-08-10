# Graph Report - Dompetku  (2026-08-10)

## Corpus Check
- 160 files · ~131,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1019 nodes · 2789 edges · 87 communities (61 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea45ddf0`
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
- NetWorthCard.tsx
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
- motivationQuotes.ts
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- expo
- expo-dev-client
- expo-document-picker
- expo-linear-gradient
- expo-notifications
- babel-preset-expo
- expo-splash-screen
- index.ts
- @expo/vector-icons
- @hookform/resolvers
- CategoriesScreen.tsx
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
- ExpenseFormScreen.tsx
- LevelGuideScreen.tsx
- AchievementService.ts
- CurrencyInput.tsx
- EmergencyFundCard.tsx
- babel-preset-expo

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 79 edges
2. `FONTS` - 74 edges
3. `SPACING` - 72 edges
4. `RADIUS` - 58 edges
5. `formatCurrency()` - 56 edges
6. `formatCompact()` - 43 edges
7. `Card()` - 40 edges
8. `SavingModel` - 39 edges
9. `Text()` - 38 edges
10. `useDashboardData()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `routeSaleProceeds()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `saveFinancialScoreSnapshot()` --references--> `realm`  [EXTRACTED]
  src/services/FinancialScoreService.ts → package.json
- `runPassiveIncomeSchedule()` --references--> `realm`  [EXTRACTED]
  src/services/PassiveIncomeScheduler.ts → package.json
- `applyDebtPaymentFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json

## Import Cycles
- None detected.

## Communities (87 total, 26 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.06
Nodes (76): realm, realm, ChartPeriod, CategoryModel, DebtModel, DebtType, DebtPaymentModel, ExpenseModel (+68 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.09
Nodes (19): DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, DebtTypeForReminder, EmergencyFundStatus, FinancialProjection, FinancialSuggestionCard, FireInfo (+11 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.11
Nodes (34): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+26 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.17
Nodes (12): CardProps, styles, Stack, EMOJIS, NavProp, Props, RoutePropT, styles (+4 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.14
Nodes (14): Text(), TextProps, variantStyles, weightMap, styles, NeracaCard(), Props, styles (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 7 - "FONTS"
Cohesion: 0.18
Nodes (13): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, useCashflowChart(), Cashflow12mCard(), Props, styles (+5 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+15 more)

### Community 9 - "index.ts"
Cohesion: 0.16
Nodes (12): Stack, buildMonthOptions(), CATEGORY_EMOJIS, ExpenseItem(), ExpenseItemProps, ExpenseListScreen(), ExpenseStackParamList, MonthOption (+4 more)

### Community 10 - "index.ts"
Cohesion: 0.13
Nodes (17): EmptyState(), EmptyStateProps, styles, Stack, ModalType, Props, styles, TYPE_COLOR (+9 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.14
Nodes (21): Button(), ButtonProps, styles, InvestmentModel, Stack, InvestmentDividendScreen(), Props, styles (+13 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.12
Nodes (19): BackButton(), BackButtonProps, styles, PhysicalAssetModel, Stack, CATEGORIES, fs, NavProp (+11 more)

### Community 13 - "COLORS"
Cohesion: 0.12
Nodes (13): AssetsNavigator(), DashboardScreen(), DebtNavigator(), InvestmentNavigator(), SavingsNavigator(), SettingsNavigator(), AssetsTabNavigator(), ROUTE_EMOJI (+5 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.17
Nodes (12): GoalsNavigator(), AchievementsScreen(), NavProp, Props, styles, CategoryFormScreen(), EMOJI_OPTIONS, Props (+4 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.20
Nodes (17): PassiveIncomeModel, categoryMeta(), PassiveIncomeListScreen(), styles, BreakdownRow(), FireCalculatorScreen(), NavProp, Props (+9 more)

### Community 16 - "RADIUS"
Cohesion: 0.12
Nodes (18): Cashflow30dCard(), MotivationCard(), styles, Props, RemindersBell(), styles, Props, Reminder (+10 more)

### Community 17 - "dependencies"
Cohesion: 0.13
Nodes (15): dayjs, expo-document-picker, expo-splash-screen, dependencies, dayjs, expo-document-picker, expo-splash-screen, react (+7 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.13
Nodes (14): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+6 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DebtFormScreen.tsx"
Cohesion: 0.21
Nodes (13): buildQuotes(), CategorySource, getBank(), getQuotesForCategory(), getRandomQuote(), QUOTE_CATEGORY_LABEL, QuoteCategory, SOURCES (+5 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.15
Nodes (11): ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryOption, EXPENSE_EMOJIS, INCOME_EMOJIS, MonthOption, NavProp (+3 more)

### Community 22 - "CashflowScreen.tsx"
Cohesion: 0.26
Nodes (12): PhysicalAssetSellScreen(), EmergencyPickerModal(), NeracaRow(), PaymentItem(), ScheduleItem(), DebtItem(), SavingsDetailScreen(), ExpenseItem() (+4 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "currency.ts"
Cohesion: 0.29
Nodes (7): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.18
Nodes (11): Stack, IncomeFormScreen(), buildMonthOptions(), CATEGORY_EMOJIS, IncomeItem(), IncomeItemProps, IncomeListScreen(), IncomeStackParamList (+3 more)

### Community 27 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.19
Nodes (9): DebtRatioCard(), Props, styles, Props, styles, SectionTitle(), styles, styles (+1 more)

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
Cohesion: 0.22
Nodes (9): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, PassiveIncomeStackParamList (+1 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "NetWorthCard.tsx"
Cohesion: 0.06
Nodes (39): App(), plugins, expo-background-task, expo-sharing, AppInner(), AppProviders(), styles, ErrorBoundary (+31 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "DonutChart.tsx"
Cohesion: 0.16
Nodes (9): DonutChartProps, Segment, styles, DataPoint, SimpleBarChartProps, styles, ColorKey, SPACING (+1 more)

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 41 - "scripts"
Cohesion: 0.11
Nodes (18): AiDetailModal(), styles, GoalsSection(), styles, HealthBadges(), Props, styles, NetWorthCard() (+10 more)

### Community 42 - "FAB.tsx"
Cohesion: 0.17
Nodes (12): ProgressBar(), ProgressBarProps, styles, FreedomCard(), Props, styles, ChecklistItem, LevelDetailModal() (+4 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "SettingsNavigator.tsx"
Cohesion: 0.21
Nodes (10): FAB(), lighten(), Props, styles, InvestmentListScreen(), styles, TYPE_EMOJIS, TYPE_LABELS (+2 more)

### Community 46 - "motivationQuotes.ts"
Cohesion: 0.40
Nodes (4): AmountDisplay(), AmountDisplayProps, sizes, styles

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 52 - "expo-document-picker"
Cohesion: 0.24
Nodes (14): FinancialScoreModel, saveFinancialScoreSnapshot(), calcCashflowScore(), calcDebtHealthScore(), calcEmergencyFundScore(), calcInvestmentHealthScore(), calcPassiveIncomeScore(), computeFinancialScore() (+6 more)

### Community 56 - "expo-splash-screen"
Cohesion: 0.23
Nodes (15): useDashboardData(), checkAndUnlockAchievements(), cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, DebtTypeForNotification, refreshDailyReminders(), refreshDebtReminders() (+7 more)

### Community 57 - "index.ts"
Cohesion: 0.22
Nodes (9): Card(), Input, InputProps, styles, AiCard(), healthColor(), styles, DAY_LABELS (+1 more)

### Community 60 - "CategoriesScreen.tsx"
Cohesion: 0.18
Nodes (11): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen(), CategoryType (+3 more)

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 75 - "IncomeFormScreen.tsx"
Cohesion: 0.29
Nodes (6): CATEGORIES, FormValues, NavProp, RouteType, schema, styles

### Community 80 - "ReportScreen.tsx"
Cohesion: 0.33
Nodes (5): CategoryBarList(), categoryBreakdown(), Mode, ReportScreen(), styles

### Community 81 - "ExpenseFormScreen.tsx"
Cohesion: 0.19
Nodes (10): CATEGORIES, ExpenseFormScreen(), FormValues, NavProp, RouteType, schema, styles, Stack (+2 more)

### Community 82 - "LevelGuideScreen.tsx"
Cohesion: 0.33
Nodes (5): LEVEL_EXAMPLES, LevelGuideScreen(), NavProp, Props, styles

### Community 83 - "AchievementService.ts"
Cohesion: 0.47
Nodes (4): AchievementCheckInput, ACHIEVEMENT_DEFS, AchievementDef, AchievementType

### Community 84 - "CurrencyInput.tsx"
Cohesion: 0.50
Nodes (4): CurrencyInput(), CurrencyInputProps, formatThousands(), styles

### Community 85 - "EmergencyFundCard.tsx"
Cohesion: 0.50
Nodes (4): EmergencyFundCard(), Props, styles, EmergencyFundInfo

## Knowledge Gaps
- **455 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+450 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `DebtListScreen.tsx`, `DebtDetailScreen.tsx`, `package.json`, `expo-sharing`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `babel-preset-expo`, `@expo/vector-icons`, `@hookform/resolvers`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-file-system`, `expo-task-manager`, `react-native`, `victory-native`, `babel-preset-expo`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `realm` connect `DebtListScreen.tsx` to `GoalFormScreen.tsx`, `dependencies`, `expo-document-picker`, `CashflowScreen.tsx`, `expo-splash-screen`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `COLORS` connect `FAB.tsx` to `DebtListScreen.tsx`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `FONTS`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `ExpenseListScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `formatCurrency`, `NetWorthCard.tsx`, `DonutChart.tsx`, `scripts`, `SettingsNavigator.tsx`, `motivationQuotes.ts`, `index.ts`, `CategoriesScreen.tsx`, `IncomeFormScreen.tsx`, `ReportScreen.tsx`, `ExpenseFormScreen.tsx`, `LevelGuideScreen.tsx`, `CurrencyInput.tsx`, `EmergencyFundCard.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _455 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DebtListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05659583420997265 - nodes in this community are weakly interconnected._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._