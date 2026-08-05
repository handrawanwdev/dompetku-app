# Graph Report - Dompetku  (2026-08-05)

## Corpus Check
- 154 files · ~130,607 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 996 nodes · 2652 edges · 78 communities (51 shown, 27 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4529bb32`
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
- expo-file-system
- expo-task-manager
- react-native
- victory-native
- ExpenseFormScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 73 edges
2. `FONTS` - 68 edges
3. `SPACING` - 66 edges
4. `RADIUS` - 53 edges
5. `formatCurrency()` - 49 edges
6. `formatCompact()` - 43 edges
7. `Card()` - 40 edges
8. `Text()` - 37 edges
9. `SavingModel` - 37 edges
10. `useDashboardData()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `clearAllData()` --references--> `realm`  [EXTRACTED]
  src/services/DevSeeder.ts → package.json
- `saveFinancialScoreSnapshot()` --references--> `realm`  [EXTRACTED]
  src/services/FinancialScoreService.ts → package.json
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `applyDebtPaymentFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `depositToSavingFromCash()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json

## Import Cycles
- None detected.

## Communities (78 total, 27 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.07
Nodes (81): realm, realm, expo-background-task, realmConfig, ChartPeriod, useCashflowChart(), CategoryModel, DebtModel (+73 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.08
Nodes (24): Props, Props, DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, DebtTypeForReminder, EmergencyFundInfo, EmergencyFundStatus (+16 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.07
Nodes (51): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+43 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.22
Nodes (8): Button(), ButtonProps, styles, EMOJIS, NavProp, Props, RoutePropT, styles

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.14
Nodes (11): AiCard(), healthColor(), styles, ProjectionGrid(), styles, styles, Props, styles (+3 more)

### Community 6 - "index.ts"
Cohesion: 0.06
Nodes (38): Input, ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen() (+30 more)

### Community 7 - "FONTS"
Cohesion: 0.17
Nodes (11): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, styles, Cashflow7dCard(), styles, CategoryBarList() (+3 more)

### Community 8 - "expo"
Cohesion: 0.07
Nodes (26): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+18 more)

### Community 9 - "index.ts"
Cohesion: 0.16
Nodes (12): Stack, ExpenseFormScreen(), buildMonthOptions(), CATEGORY_EMOJIS, ExpenseItemProps, ExpenseListScreen(), ExpenseStackParamList, MonthOption (+4 more)

### Community 10 - "index.ts"
Cohesion: 0.12
Nodes (20): BackButton(), BackButtonProps, styles, SavingsNavigator(), Stack, ModalType, MoveType, Props (+12 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.12
Nodes (14): InvestmentNavigator(), Stack, fieldStyles, INVESTMENT_TYPES, InvestmentFormScreen(), NavProp, Props, RoutePropT (+6 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.13
Nodes (17): AssetsNavigator(), Stack, CATEGORIES, fs, NavProp, PhysicalAssetFormScreen(), Props, RoutePropT (+9 more)

### Community 13 - "COLORS"
Cohesion: 0.06
Nodes (33): DebtType, DashboardScreen(), DebtNavigator(), Stack, DEBT_TYPES, DebtFormScreen(), FormValues, HAS_DUE_DATE (+25 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.15
Nodes (13): EmptyState(), EmptyStateProps, styles, FAB(), lighten(), Props, styles, GoalsNavigator() (+5 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.15
Nodes (7): DataPoint, SimpleBarChartProps, styles, styles, HealthBadges(), Props, styles

### Community 16 - "RADIUS"
Cohesion: 0.13
Nodes (25): AiDetailModal(), styles, Cashflow12mCard(), Cashflow30dCard(), DebtRatioCard(), EmergencyFundCard(), FreedomCard(), GoalsSection() (+17 more)

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
Cohesion: 0.21
Nodes (13): buildQuotes(), CategorySource, getBank(), getQuotesForCategory(), getRandomQuote(), QUOTE_CATEGORY_LABEL, QuoteCategory, SOURCES (+5 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.15
Nodes (11): ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryOption, EXPENSE_EMOJIS, INCOME_EMOJIS, MonthOption, NavProp (+3 more)

### Community 22 - "CashflowScreen.tsx"
Cohesion: 0.12
Nodes (22): EmergencyPickerModal(), NeracaRow(), FUNDING_SOURCES, NavProp, PaymentItem(), PaymentItemProps, PaymentModal(), PaymentModalProps (+14 more)

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
Cohesion: 0.16
Nodes (17): Card(), ProgressBar(), ProgressBarProps, styles, Text(), styles, Props, styles (+9 more)

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
Cohesion: 0.18
Nodes (11): CurrencyInput(), CurrencyInputProps, formatThousands(), styles, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT (+3 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "NetWorthCard.tsx"
Cohesion: 0.08
Nodes (32): App(), AppInner(), AppProviders(), styles, ErrorBoundary, Props, State, styles (+24 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "DonutChart.tsx"
Cohesion: 0.15
Nodes (11): DonutChartProps, Segment, styles, InputProps, styles, styles, Props, styles (+3 more)

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 41 - "scripts"
Cohesion: 0.20
Nodes (7): Props, styles, Summary, styles, Summary, SummaryItem(), DashboardData

### Community 42 - "FAB.tsx"
Cohesion: 0.32
Nodes (6): Props, styles, ChecklistItem, Props, styles, FinancialLevel

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "SettingsNavigator.tsx"
Cohesion: 0.22
Nodes (8): CardProps, styles, InvestmentListScreen(), styles, TYPE_EMOJIS, TYPE_LABELS, calcProfitLoss(), calcROI()

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
Cohesion: 0.50
Nodes (3): TextProps, variantStyles, weightMap

### Community 62 - "react-native-mmkv"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 81 - "ExpenseFormScreen.tsx"
Cohesion: 0.13
Nodes (15): CATEGORIES, FormValues, NavProp, RouteType, schema, styles, CATEGORIES, FormValues (+7 more)

## Knowledge Gaps
- **443 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+438 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `DebtListScreen.tsx`, `DebtDetailScreen.tsx`, `package.json`, `expo-sharing`, `expo`, `expo-dev-client`, `expo-linear-gradient`, `expo-notifications`, `babel-preset-expo`, `expo-splash-screen`, `@expo/vector-icons`, `@hookform/resolvers`, `react-hook-form`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`, `expo-file-system`, `expo-task-manager`, `react-native`, `victory-native`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `realm` connect `DebtListScreen.tsx` to `dependencies`, `FinancialAdvisorService.ts`, `COLORS`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `COLORS` connect `FONTS` to `DebtListScreen.tsx`, `FinancialAdvisorService.ts`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `index.ts`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `ExpenseListScreen.tsx`, `CashflowScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `formatCurrency`, `NetWorthCard.tsx`, `DonutChart.tsx`, `scripts`, `FAB.tsx`, `SettingsNavigator.tsx`, `motivationQuotes.ts`, `expo-document-picker`, `ExpenseFormScreen.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _443 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DebtListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06630223946393934 - nodes in this community are weakly interconnected._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._