# Graph Report - Dompetku  (2026-09-21)

## Corpus Check
- 161 files · ~133,285 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1031 nodes · 2800 edges · 80 communities (53 shown, 27 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `febd4b09`
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
- expo-linear-gradient
- expo-notifications
- babel-preset-expo
- NetWorthPoint
- @expo/vector-icons
- @hookform/resolvers
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
- BackupService.ts
- react-native
- victory-native
- expo-background-task
- expo-splash-screen
- CurrencyInput.tsx

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 84 edges
2. `FONTS` - 75 edges
3. `SPACING` - 72 edges
4. `RADIUS` - 57 edges
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
- `getKasBebasBalance()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `clearAllData()` --references--> `realm`  [EXTRACTED]
  src/services/DevSeeder.ts → package.json
- `seedDummyData()` --references--> `realm`  [EXTRACTED]
  src/services/DevSeeder.ts → package.json

## Import Cycles
- None detected.

## Communities (80 total, 27 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.18
Nodes (11): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen(), CategoryType (+3 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.08
Nodes (24): Props, Props, DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, DebtTypeForReminder, EmergencyFundInfo, EmergencyFundStatus (+16 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.08
Nodes (44): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+36 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.11
Nodes (18): AiDetailModal(), styles, Cashflow7dCard(), EmergencyFundCard(), styles, HealthBadges(), Props, styles (+10 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.20
Nodes (17): Cashflow12mCard(), Cashflow30dCard(), DebtRatioCard(), FinancialInsightsCard(), FreedomCard(), GoalProgressCard(), LevelDetailModal(), MotivationCard() (+9 more)

### Community 6 - "index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 7 - "FONTS"
Cohesion: 0.22
Nodes (10): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, useCashflowChart(), Props, styles, Props (+2 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+15 more)

### Community 9 - "index.ts"
Cohesion: 0.06
Nodes (79): App(), plugins, expo-background-task, expo-sharing, AppInner(), AppProviders(), styles, realmConfig (+71 more)

### Community 10 - "index.ts"
Cohesion: 0.16
Nodes (18): PhysicalAssetListScreen(), EmergencyPickerModal(), NeracaRow(), PaymentItem(), ScheduleItem(), DebtItem(), CashItem(), SavingsDetailScreen() (+10 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.09
Nodes (22): AssetMoveKind, CONFIG, Props, DebtPaymentKind, DebtPaymentSuccessAnimation(), Props, TITLE, CONFIG (+14 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.25
Nodes (8): AchievementsScreen(), NavProp, Props, styles, AchievementCheckInput, ACHIEVEMENT_DEFS, AchievementDef, AchievementType

### Community 13 - "COLORS"
Cohesion: 0.08
Nodes (27): DebtType, DashboardScreen(), DebtNavigator(), Stack, Category, CATEGORY_OPTIONS, categoryOf(), DEBT_TYPES (+19 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.19
Nodes (11): CategoryFormScreen(), EMOJI_OPTIONS, Props, styles, LEVEL_EXAMPLES, LevelGuideScreen(), NavProp, Props (+3 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.16
Nodes (14): EmptyState(), EmptyStateProps, styles, ProgressBar(), ProgressBarProps, styles, ModalType, Props (+6 more)

### Community 16 - "RADIUS"
Cohesion: 0.15
Nodes (19): Card(), Text(), styles, Props, styles, SEVERITY_COLOR, styles, Props (+11 more)

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
Cohesion: 0.13
Nodes (18): ErrorBoundary, Props, State, styles, DiagnosisScreen(), SOURCE_LABEL, styles, buildReportText() (+10 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.24
Nodes (7): FAB(), lighten(), Props, styles, CATEGORY_EMOJIS, CATEGORY_LABELS, styles

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
Cohesion: 0.32
Nodes (6): InvestmentListScreen(), styles, TYPE_EMOJIS, TYPE_LABELS, calcProfitLoss(), calcROI()

### Community 26 - "ReportScreen.tsx"
Cohesion: 0.25
Nodes (6): CardProps, styles, DevToolsScreen(), styles, clearAllData(), SeedSummary

### Community 27 - "NetWorthCard.tsx"
Cohesion: 0.22
Nodes (7): Props, styles, Summary, styles, Summary, SummaryItem(), DashboardData

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
Cohesion: 0.12
Nodes (20): CurrencyInput(), CurrencyInputProps, formatThousands(), styles, buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES (+12 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.17
Nodes (14): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, categoryMeta() (+6 more)

### Community 34 - "date.ts"
Cohesion: 0.13
Nodes (16): AssetSuccessAnimation(), Button(), ButtonProps, styles, AssetsNavigator(), Stack, CATEGORIES, fs (+8 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "AchievementsScreen.tsx"
Cohesion: 0.18
Nodes (20): realm, realm, SavingHistoryModel, SavingModel, Props, DebtPaymentScreen(), FUNDING_SOURCES, Props (+12 more)

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "CashScreen.tsx"
Cohesion: 0.17
Nodes (12): Props, Reminder, styles, Props, Reminder, styles, Props, Reminder (+4 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "FAB.tsx"
Cohesion: 0.32
Nodes (6): Props, styles, ChecklistItem, Props, styles, FinancialLevel

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 56 - "NetWorthPoint"
Cohesion: 0.13
Nodes (22): BackButton(), BackButtonProps, styles, InvestmentSuccessAnimation(), PhysicalAssetSellScreen(), Stack, InvestmentDividendScreen(), Props (+14 more)

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 75 - "IncomeFormScreen.tsx"
Cohesion: 0.07
Nodes (29): TransactionSuccessAnimation(), CATEGORIES, ExpenseFormScreen(), FormValues, NavProp, RouteType, schema, styles (+21 more)

### Community 84 - "CurrencyInput.tsx"
Cohesion: 0.08
Nodes (27): DonutChartProps, Segment, styles, DataPoint, SimpleBarChartProps, styles, AmountDisplay(), AmountDisplayProps (+19 more)

## Knowledge Gaps
- **467 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+462 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`, `AchievementsScreen.tsx`, `FAB.tsx`, `expo-background-task`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `babel-preset-expo`, `@expo/vector-icons`, `@hookform/resolvers`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-file-system`, `react-native`, `victory-native`, `expo-background-task`, `expo-splash-screen`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `realm` connect `AchievementsScreen.tsx` to `dependencies`, `ReportScreen.tsx`, `FinancialAdvisorService.ts`, `index.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `COLORS` connect `CurrencyInput.tsx` to `DebtListScreen.tsx`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `FONTS`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `ReportScreen.tsx`, `NetWorthCard.tsx`, `PhysicalAssetListScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `date.ts`, `AchievementsScreen.tsx`, `CashScreen.tsx`, `FAB.tsx`, `NetWorthPoint`, `IncomeFormScreen.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _467 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `FinancialAdvisorService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08106473079249849 - nodes in this community are weakly interconnected._