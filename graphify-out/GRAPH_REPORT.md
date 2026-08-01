# Graph Report - Dompetku  (2026-08-01)

## Corpus Check
- 146 files · ~121,889 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 941 nodes · 2553 edges · 71 communities (47 shown, 24 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.8)
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
- Financial Freedom Level System — Implementation Plan
- 10. Dashboard Widgets
- scripts
- FAB.tsx
- Income Module
- Settings Module
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

## God Nodes (most connected - your core abstractions)
1. `COLORS` - 69 edges
2. `FONTS` - 65 edges
3. `SPACING` - 63 edges
4. `RADIUS` - 50 edges
5. `formatCurrency()` - 49 edges
6. `SavingModel` - 44 edges
7. `formatCompact()` - 41 edges
8. `Card()` - 40 edges
9. `useDashboardData()` - 40 edges
10. `Text()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `checkAndUnlockAchievements()` --references--> `realm`  [EXTRACTED]
  src/services/AchievementService.ts → package.json
- `applyDebtPaymentFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `applyExpenseFunding()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `applyIncomeAllocation()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json
- `depositToSavingFromCash()` --references--> `realm`  [EXTRACTED]
  src/services/AllocationService.ts → package.json

## Import Cycles
- None detected.

## Communities (71 total, 24 thin omitted)

### Community 0 - "DebtListScreen.tsx"
Cohesion: 0.06
Nodes (94): realm, realm, ChartPeriod, useCashflowChart(), CategoryModel, DebtModel, DebtPaymentModel, ExpenseModel (+86 more)

### Community 1 - "useDashboardData.ts"
Cohesion: 0.09
Nodes (21): Props, Props, DAY_NAMES_ID, DebtFreedomInfo, DebtReminderInput, EmergencyFundInfo, EmergencyFundStatus, FinancialProjection (+13 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "FinancialAdvisorService.ts"
Cohesion: 0.09
Nodes (41): AIFinancialCard, buildFinancialAdvisorReport(), buildScoreExplanation(), buildSmartSuggestion(), CONTRIBUTOR_LABELS, FinancialHealthLabel, getHealthLabel(), ScoreContributor (+33 more)

### Community 4 - "SettingsNavigator.tsx"
Cohesion: 0.25
Nodes (8): AchievementsScreen(), NavProp, Props, styles, AchievementCheckInput, ACHIEVEMENT_DEFS, AchievementDef, AchievementType

### Community 5 - "DiagnosisScreen.tsx"
Cohesion: 0.07
Nodes (30): App(), AppInner(), AppProviders(), styles, ErrorBoundary, Props, State, styles (+22 more)

### Community 6 - "index.ts"
Cohesion: 0.06
Nodes (34): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, CategoriesScreen(), CategoryType (+26 more)

### Community 7 - "FONTS"
Cohesion: 0.05
Nodes (95): DonutChartProps, Segment, styles, GroupedBarChart(), GroupedBarChartProps, GroupedDataPoint, styles, DataPoint (+87 more)

### Community 8 - "expo"
Cohesion: 0.07
Nodes (26): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+18 more)

### Community 9 - "index.ts"
Cohesion: 0.12
Nodes (16): CATEGORIES, FormValues, NavProp, RouteType, schema, SOURCES, styles, CATEGORIES (+8 more)

### Community 10 - "index.ts"
Cohesion: 0.22
Nodes (9): GoalsNavigator(), LEVEL_EXAMPLES, LevelGuideScreen(), NavProp, Props, styles, ParametersScreen(), SettingsStackParamList (+1 more)

### Community 11 - "InvestmentListScreen.tsx"
Cohesion: 0.11
Nodes (16): CurrencyInput(), formatThousands(), InvestmentNavigator(), Stack, fieldStyles, INVESTMENT_TYPES, NavProp, Props (+8 more)

### Community 12 - "SavingsDetailScreen.tsx"
Cohesion: 0.16
Nodes (15): EmptyState(), EmptyStateProps, styles, SavingsNavigator(), Stack, ModalType, Props, styles (+7 more)

### Community 13 - "COLORS"
Cohesion: 0.22
Nodes (7): AssetsNavigator(), Stack, AssetsStackParamList, ROUTE_EMOJI, styles, Tab, SHADOWS

### Community 14 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.13
Nodes (13): Button(), ButtonProps, styles, CardProps, styles, CATEGORIES, fs, NavProp (+5 more)

### Community 15 - "GoalFormScreen.tsx"
Cohesion: 0.21
Nodes (12): GoalModel, Props, Stack, EMOJIS, GoalFormScreen(), NavProp, Props, RoutePropT (+4 more)

### Community 16 - "RADIUS"
Cohesion: 0.24
Nodes (8): BackButton(), BackButtonProps, styles, EMOJI_OPTIONS, Props, SavingsFormScreen(), styles, parseCurrency()

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
Cohesion: 0.29
Nodes (7): buildCalendarDays(), DateInput(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

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
Cohesion: 0.40
Nodes (4): AmountDisplay(), AmountDisplayProps, sizes, styles

### Community 25 - "IncomeListScreen.tsx"
Cohesion: 0.19
Nodes (10): Stack, buildMonthOptions(), CATEGORY_EMOJIS, IncomeItem(), IncomeItemProps, IncomeListScreen(), IncomeStackParamList, MonthOption (+2 more)

### Community 26 - "DebtDetailScreen.tsx"
Cohesion: 0.12
Nodes (16): Input, DebtNavigator(), Stack, FUNDING_SOURCES, NavProp, PaymentItemProps, PaymentModalProps, RouteType (+8 more)

### Community 27 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.22
Nodes (9): PassiveIncomeNavigator(), Stack, NavProp, PassiveIncomeFormScreen(), Props, RoutePropT, styles, PassiveIncomeStackParamList (+1 more)

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
Nodes (10): NeracaRow(), PaymentItem(), PaymentModal(), DebtItem(), ExpenseItem(), BreakdownRow(), ExpenseItem(), IncomeItem() (+2 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "NetWorthCard.tsx"
Cohesion: 0.52
Nodes (6): categoryMeta(), PassiveIncomeListScreen(), styles, getPassiveIncomeStatus(), PASSIVE_INCOME_CATEGORIES, toMonthlyAmount()

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 38 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.33
Nodes (5): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 41 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 42 - "FAB.tsx"
Cohesion: 0.24
Nodes (7): FAB(), lighten(), Props, styles, CATEGORY_EMOJIS, CATEGORY_LABELS, styles

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

## Knowledge Gaps
- **427 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+422 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `DebtListScreen.tsx`, `package.json`, `expo`, `expo-dev-client`, `expo-document-picker`, `expo-linear-gradient`, `expo-notifications`, `expo-sharing`, `expo-splash-screen`, `expo-status-bar`, `@expo/vector-icons`, `@hookform/resolvers`, `react`, `react-hook-form`, `react-native-mmkv`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`, `@realm/react`, `zod`, `zustand`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `realm` connect `DebtListScreen.tsx` to `dependencies`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `COLORS` connect `FONTS` to `DebtListScreen.tsx`, `SettingsNavigator.tsx`, `DiagnosisScreen.tsx`, `index.ts`, `index.ts`, `index.ts`, `InvestmentListScreen.tsx`, `SavingsDetailScreen.tsx`, `COLORS`, `PhysicalAssetListScreen.tsx`, `GoalFormScreen.tsx`, `RADIUS`, `DebtFormScreen.tsx`, `ExpenseListScreen.tsx`, `CashflowScreen.tsx`, `currency.ts`, `IncomeListScreen.tsx`, `DebtDetailScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `NetWorthCard.tsx`, `FAB.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _427 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DebtListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05938697318007663 - nodes in this community are weakly interconnected._
- **Should `useDashboardData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._