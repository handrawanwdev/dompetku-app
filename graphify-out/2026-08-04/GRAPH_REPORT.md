# Graph Report - Dompetku  (2026-08-04)

## Corpus Check
- 150 files · ~121,757 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 961 nodes · 2565 edges · 80 communities (54 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b88c74e`
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
- date.ts
- 11. Data Models
- 12. Financial Calculations
- FireCalculatorScreen.tsx
- Financial Freedom Level System — Implementation Plan
- 10. Dashboard Widgets
- DebtListScreen.tsx
- scripts
- FAB.tsx
- Income Module
- Settings Module
- expo-sharing
- LevelDetailModal.tsx
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- expo
- expo-dev-client
- expo-document-picker
- expo-linear-gradient
- expo-notifications
- expo-sharing
- expo-splash-screen
- expo-status-bar
- @expo/vector-icons
- @hookform/resolvers
- react
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
- expo-background-task
- expo-file-system
- expo-task-manager
- react-native
- victory-native

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 72 edges
2. `FONTS` - 68 edges
3. `SPACING` - 65 edges
4. `RADIUS` - 52 edges
5. `formatCurrency()` - 50 edges
6. `formatCompact()` - 43 edges
7. `Card()` - 40 edges
8. `SavingModel` - 37 edges
9. `Text()` - 36 edges
10. `useDashboardData()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `applyDebtPaymentFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `getKasBebasBalance()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `routeSaleProceeds()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `clearAllData()` --references--> `realm`  [EXTRACTED]
  src/services/DevSeeder.ts → package.json

## Import Cycles
- None detected.

## Communities (80 total, 26 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.22
Nodes (15): CategoryModel, DebtPaymentModel, FinancialMilestoneModel, GoalModel, PhysicalAssetModel, NavProp, Props, SettingsMainScreen() (+7 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.08
Nodes (21): Props, Props, DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, EmergencyFundInfo, EmergencyFundStatus, FinancialProjection (+13 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.08
Nodes (43): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+35 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.06
Nodes (32): CardProps, styles, AssetsNavigator(), Stack, GoalsNavigator(), InvestmentNavigator(), SavingsNavigator(), NavProp (+24 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.23
Nodes (14): DiagnosisScreen(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs(), ErrorLogEntry, ErrorSource, getDeviceInfo() (+6 more)

### Community 6 - "index.ts"
Cohesion: 0.08
Nodes (27): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen(), CategoryType (+19 more)

### Community 7 - "FONTS"
Cohesion: 0.12
Nodes (17): DonutChartProps, Segment, styles, DataPoint, SimpleBarChartProps, styles, CurrencyInputProps, styles (+9 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (23): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+15 more)

### Community 9 - "index.ts"
Cohesion: 0.12
Nodes (27): realm, realm, SavingHistoryModel, CATEGORIES, FormValues, IncomeFormScreen(), NavProp, RouteType (+19 more)

### Community 10 - "index.ts"
Cohesion: 0.22
Nodes (10): DAY_LABELS, ParametersScreen(), styles, getSettings(), saveSettings(), StorageKeys, DEFAULT_SETTINGS, SettingsState (+2 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.13
Nodes (18): PhysicalAssetFormScreen(), PaymentModal(), Stack, fieldStyles, INVESTMENT_TYPES, InvestmentFormScreen(), NavProp, Props (+10 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.13
Nodes (18): EmptyState(), EmptyStateProps, styles, Input, SavingModel, Props, Props, PaymentModalProps (+10 more)

### Community 13 - "COLORS"
Cohesion: 0.16
Nodes (18): Card(), ProgressBar(), Text(), TextProps, variantStyles, weightMap, DebtRatioCard(), Props (+10 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.11
Nodes (17): Button(), ButtonProps, styles, buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles (+9 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.14
Nodes (16): BackButton(), BackButtonProps, styles, FAB(), lighten(), Props, styles, Stack (+8 more)

### Community 16 - "RADIUS"
Cohesion: 0.11
Nodes (20): AiCard(), healthColor(), styles, FreedomCard(), NeracaCard(), Props, styles, Props (+12 more)

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
Nodes (14): AiDetailModal(), styles, Cashflow12mCard(), styles, GoalsSection(), HealthBadges(), Props, styles (+6 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.06
Nodes (33): Stack, CATEGORIES, ExpenseFormScreen(), FormValues, NavProp, RouteType, schema, styles (+25 more)

### Community 22 - "CashflowScreen.tsx"
Cohesion: 0.21
Nodes (17): useCashflowChart(), IncomeModel, PassiveIncomeModel, Props, Props, Props, useDashboardData(), checkAndUnlockAchievements() (+9 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "currency.ts"
Cohesion: 0.15
Nodes (12): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, ProgressBarProps, styles, Cashflow30dCard(), styles (+4 more)

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.13
Nodes (14): AmountDisplay(), AmountDisplayProps, sizes, styles, Stack, buildMonthOptions(), CATEGORY_EMOJIS, IncomeItem() (+6 more)

### Community 26 - "DebtDetailScreen.tsx"
Cohesion: 0.18
Nodes (11): CurrencyInput(), formatThousands(), DebtNavigator(), Stack, DebtFormScreen(), FormValues, NavProp, RouteType (+3 more)

### Community 27 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.17
Nodes (17): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, categoryMeta() (+9 more)

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
Cohesion: 0.17
Nodes (16): CATEGORY_EMOJIS, CATEGORY_LABELS, PhysicalAssetListScreen(), styles, EmergencyPickerModal(), NeracaRow(), DashboardScreen(), PaymentItem() (+8 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "NetWorthCard.tsx"
Cohesion: 0.18
Nodes (10): App(), AppInner(), AppProviders(), styles, realmConfig, ALL_MODELS, MainTabNavigator(), registerDebtReminderBackgroundTask() (+2 more)

### Community 34 - "date.ts"
Cohesion: 0.13
Nodes (9): DebtDetailScreen(), FUNDING_SOURCES, NavProp, PaymentItemProps, RouteType, styles, applyDebtPaymentFunding(), getKasBebasBalance() (+1 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "FireCalculatorScreen.tsx"
Cohesion: 0.23
Nodes (9): ChartPeriod, ExpenseModel, InvestmentModel, BreakdownRow(), FireCalculatorScreen(), NavProp, Props, styles (+1 more)

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "DebtListScreen.tsx"
Cohesion: 0.29
Nodes (9): DebtModel, DebtItem(), DebtItemProps, DebtListScreen(), NavProp, styles, getDebtFreedomStatus(), getReminderStatus() (+1 more)

### Community 41 - "scripts"
Cohesion: 0.18
Nodes (8): NetWorthCard(), Props, styles, Summary, styles, Summary, SummaryItem(), DashboardData

### Community 42 - "FAB.tsx"
Cohesion: 0.22
Nodes (4): ErrorBoundary, Props, State, styles

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "expo-sharing"
Cohesion: 0.29
Nodes (4): plugins, expo-background-task, expo-sharing, BackupData

### Community 46 - "LevelDetailModal.tsx"
Cohesion: 0.33
Nodes (6): Props, ChecklistItem, LevelDetailModal(), Props, styles, FinancialLevel

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 52 - "expo-document-picker"
Cohesion: 0.33
Nodes (5): CategoryBarList(), categoryBreakdown(), Mode, ReportScreen(), styles

### Community 60 - "react"
Cohesion: 0.48
Nodes (6): cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshDailyReminders(), refreshDebtReminders(), scheduleAt()

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

## Knowledge Gaps
- **434 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+429 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `index.ts`, `package.json`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `expo-sharing`, `expo-splash-screen`, `expo-status-bar`, `@expo/vector-icons`, `@hookform/resolvers`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-background-task`, `expo-file-system`, `expo-task-manager`, `react-native`, `victory-native`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `realm` connect `index.ts` to `DebtListScreen.tsx`, `date.ts`, `FinancialAdvisorService.ts`, `SettingsNavigator.tsx`, `dependencies`, `CashflowScreen.tsx`, `formatCurrency`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `COLORS` connect `currency.ts` to `DebtListScreen.tsx`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `index.ts`, `FONTS`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `IncomeListScreen.tsx`, `DebtDetailScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `formatCurrency`, `NetWorthCard.tsx`, `date.ts`, `FireCalculatorScreen.tsx`, `DebtListScreen.tsx`, `scripts`, `FAB.tsx`, `LevelDetailModal.tsx`, `expo-document-picker`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _434 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `FinancialAdvisorService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._