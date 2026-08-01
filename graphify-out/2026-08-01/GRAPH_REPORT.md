# Graph Report - Dompetku  (2026-08-01)

## Corpus Check
- 145 files · ~120,855 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 937 nodes · 2534 edges · 75 communities (52 shown, 23 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `92a568a5`
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
- CategoriesScreen.tsx
- Financial Freedom Level System — Implementation Plan
- 10. Dashboard Widgets
- LevelDetailModal.tsx
- scripts
- FAB.tsx
- Income Module
- Settings Module
- Text.tsx
- AiCard.tsx
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

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 69 edges
2. `FONTS` - 65 edges
3. `SPACING` - 63 edges
4. `RADIUS` - 50 edges
5. `formatCurrency()` - 48 edges
6. `formatCompact()` - 41 edges
7. `Card()` - 40 edges
8. `SavingModel` - 40 edges
9. `useDashboardData()` - 40 edges
10. `Text()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `saveFinancialScoreSnapshot()` --references--> `realm`  [EXTRACTED]
  src/services/FinancialScoreService.ts → package.json
- `applyExpenseFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `applyIncomeAllocation()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `depositToSavingFromCash()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json

## Import Cycles
- None detected.

## Communities (75 total, 23 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.06
Nodes (75): realm, realm, ChartPeriod, CategoryModel, DebtModel, DebtPaymentModel, ExpenseModel, GoalModel (+67 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.06
Nodes (64): useCashflowChart(), FinancialScoreModel, Props, Props, useDashboardData(), PassiveIncomeNavigator(), Stack, PassiveIncomeFormScreen() (+56 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.11
Nodes (33): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+25 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.07
Nodes (30): FinancialMilestoneModel, AssetsNavigator(), DashboardScreen(), InvestmentNavigator(), SavingsNavigator(), AchievementsScreen(), NavProp, Props (+22 more)

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.09
Nodes (26): App(), AppInner(), AppProviders(), styles, ErrorBoundary, Props, State, styles (+18 more)

### Community 6 - "index.ts"
Cohesion: 0.07
Nodes (31): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, getSettings(), saveSettings() (+23 more)

### Community 7 - "FONTS"
Cohesion: 0.17
Nodes (20): Card(), ProgressBar(), Text(), styles, Props, styles, Props, styles (+12 more)

### Community 8 - "expo"
Cohesion: 0.07
Nodes (26): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+18 more)

### Community 9 - "index.ts"
Cohesion: 0.18
Nodes (23): AiDetailModal(), styles, Cashflow12mCard(), Cashflow7dCard(), DebtRatioCard(), EmergencyFundCard(), EmergencyPickerModal(), FreedomCard() (+15 more)

### Community 10 - "index.ts"
Cohesion: 0.12
Nodes (12): DonutChartProps, Segment, styles, DataPoint, SimpleBarChartProps, styles, styles, styles (+4 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.13
Nodes (14): CardProps, styles, Stack, fieldStyles, INVESTMENT_TYPES, InvestmentFormScreen(), NavProp, Props (+6 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.16
Nodes (16): ProgressBarProps, styles, Stack, ModalType, Props, SavingsDetailScreen(), styles, TYPE_COLOR (+8 more)

### Community 13 - "COLORS"
Cohesion: 0.15
Nodes (14): GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, styles, Props, styles, CategoryBarList() (+6 more)

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.15
Nodes (14): Stack, CATEGORIES, fs, NavProp, PhysicalAssetFormScreen(), Props, RoutePropT, styles (+6 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.17
Nodes (13): BackButton(), BackButtonProps, styles, GoalsNavigator(), Stack, EMOJIS, NavProp, Props (+5 more)

### Community 16 - "RADIUS"
Cohesion: 0.19
Nodes (12): Button(), ButtonProps, styles, Input, InputProps, styles, EMOJI_OPTIONS, Props (+4 more)

### Community 17 - "dependencies"
Cohesion: 0.13
Nodes (15): babel-preset-expo, dayjs, expo-file-system, dependencies, babel-preset-expo, dayjs, expo-file-system, react-native (+7 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.13
Nodes (14): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+6 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DebtFormScreen.tsx"
Cohesion: 0.14
Nodes (13): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE, DebtFormScreen() (+5 more)

### Community 21 - "ExpenseListScreen.tsx"
Cohesion: 0.18
Nodes (11): Stack, buildMonthOptions(), CATEGORY_EMOJIS, ExpenseItemProps, ExpenseListScreen(), ExpenseStackParamList, MonthOption, NavProp (+3 more)

### Community 22 - "CashflowScreen.tsx"
Cohesion: 0.15
Nodes (11): ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryOption, EXPENSE_EMOJIS, INCOME_EMOJIS, MonthOption, NavProp (+3 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "currency.ts"
Cohesion: 0.15
Nodes (8): AmountDisplayProps, sizes, styles, Props, styles, Props, Reminder, styles

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.19
Nodes (10): AmountDisplay(), Stack, buildMonthOptions(), CATEGORY_EMOJIS, IncomeItemProps, IncomeListScreen(), IncomeStackParamList, MonthOption (+2 more)

### Community 26 - "DebtDetailScreen.tsx"
Cohesion: 0.19
Nodes (11): DebtNavigator(), Stack, DebtDetailScreen(), NavProp, PaymentItemProps, PaymentModal(), PaymentModalProps, RouteType (+3 more)

### Community 27 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.22
Nodes (9): CurrencyInput(), CurrencyInputProps, formatThousands(), styles, NavProp, Props, RoutePropT, styles (+1 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.20
Nodes (9): devDependencies, @types/react, typescript, main, name, private, version, @types/react (+1 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.20
Nodes (9): expo/tsconfig.base, .expo/types/**/*.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths, strict, extends (+1 more)

### Community 31 - "formatCurrency"
Cohesion: 0.27
Nodes (10): NeracaRow(), PaymentItem(), DebtItem(), ExpenseItem(), IncomeItem(), BreakdownRow(), ExpenseItem(), IncomeItem() (+2 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "NetWorthCard.tsx"
Cohesion: 0.22
Nodes (7): Props, styles, Summary, styles, Summary, SummaryItem(), DashboardData

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "CategoriesScreen.tsx"
Cohesion: 0.33
Nodes (5): EmptyState(), EmptyStateProps, styles, CategoryType, styles

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "LevelDetailModal.tsx"
Cohesion: 0.40
Nodes (5): Props, ChecklistItem, Props, styles, FinancialLevel

### Community 41 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 42 - "FAB.tsx"
Cohesion: 0.50
Nodes (4): FAB(), lighten(), Props, styles

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "Text.tsx"
Cohesion: 0.50
Nodes (3): TextProps, variantStyles, weightMap

### Community 46 - "AiCard.tsx"
Cohesion: 0.67
Nodes (3): AiCard(), healthColor(), styles

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

## Knowledge Gaps
- **425 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+420 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `DebtListScreen.tsx`, `package.json`, `expo`, `expo-dev-client`, `expo-document-picker`, `expo-linear-gradient`, `expo-notifications`, `expo-sharing`, `expo-splash-screen`, `expo-status-bar`, `@expo/vector-icons`, `@hookform/resolvers`, `react`, `react-hook-form`, `react-native-mmkv`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `realm` connect `DebtListScreen.tsx` to `dependencies`, `SettingsNavigator.tsx`, `useDashboardData.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `COLORS` connect `COLORS` to `DebtListScreen.tsx`, `useDashboardData.ts`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `FONTS`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `CashflowScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `DebtDetailScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `NetWorthCard.tsx`, `CategoriesScreen.tsx`, `LevelDetailModal.tsx`, `Text.tsx`, `AiCard.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _425 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DebtListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06181818181818182 - nodes in this community are weakly interconnected._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055905220288781934 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._