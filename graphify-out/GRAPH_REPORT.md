# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 172 files · ~203,067 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1125 nodes · 3990 edges · 56 communities (51 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24ac33cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- CategoryService.ts
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- react-native
- BackButton
- Text
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- ProfileScreen.tsx
- navigation/types.ts
- ActivityScreen.tsx
- COLORS
- theme/index.ts
- AppProviders.tsx
- ReportScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- RADIUS
- ExpenseFormScreen.tsx
- RootNavigator.tsx
- dompetku-prd.md
- FONTS
- GoalDetailScreen.tsx
- common/index.ts
- ReminderListScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- ReminderScheduler.ts
- 5. Technology Stack
- formatCurrency
- 11. Data Models
- 12. Financial Calculations
- constants/index.ts
- Card.tsx
- 10. Dashboard Widgets
- PhysicalAssetFormScreen.tsx
- budget.ts
- ObligationsCard.tsx
- Income Module
- Settings Module
- devDependencies
- InvestmentFormScreen.tsx
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- react
- Financial Freedom Level System — Implementation Plan
- scripts
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 103 edges
2. `react` - 99 edges
3. `COLORS` - 92 edges
4. `react-native` - 83 edges
5. `FONTS` - 72 edges
6. `SPACING` - 70 edges
7. `formatCurrency()` - 68 edges
8. `RADIUS` - 66 edges
9. `@expo/vector-icons` - 54 edges
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

## Communities (56 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "CategoryService.ts"
Cohesion: 0.32
Nodes (7): DEFAULT_EXPENSE_CATEGORIES, DataScreen(), Row(), Named, normalizeExpenseCategories(), kindFromLegacyCategory(), RENAMED_CATEGORIES

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.11
Nodes (17): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+9 more)

### Community 4 - "react-native"
Cohesion: 0.12
Nodes (13): react-native, react-native-svg, GroupedBarChartProps, GroupedDataPoint, styles, Props, styles, TextProps (+5 more)

### Community 5 - "BackButton"
Cohesion: 0.18
Nodes (24): BackButton(), Button(), CurrencyInput(), formatThousands(), InvestmentSuccessAnimation(), PurchaseToggle(), Field(), PhysicalAssetFormScreen() (+16 more)

### Community 6 - "Text"
Cohesion: 0.07
Nodes (73): @expo/vector-icons, Card(), Text(), BirthdayCard(), styles, BudgetSplitCard(), styles, CashflowCalendarCard() (+65 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.09
Nodes (33): react-native-reanimated, BirthdayRecap, buildBirthdayRecap(), closingLine(), BirthdaySurprise(), Stage, styles, useBirthdaySurprise (+25 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.10
Nodes (29): @react-navigation/bottom-tabs, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles (+21 more)

### Community 11 - "navigation/types.ts"
Cohesion: 0.23
Nodes (13): @react-navigation/native-stack, ProgressBar(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtItem() (+5 more)

### Community 12 - "ActivityScreen.tsx"
Cohesion: 0.11
Nodes (28): AccountDetailScreen(), Action(), Props, Row, styles, ActivityScreen(), DropdownPill(), expenseDelta() (+20 more)

### Community 13 - "COLORS"
Cohesion: 0.11
Nodes (18): AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, Coin(), COINS (+10 more)

### Community 14 - "theme/index.ts"
Cohesion: 0.12
Nodes (18): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, berry, DEFAULT_THEME_ID (+10 more)

### Community 15 - "AppProviders.tsx"
Cohesion: 0.05
Nodes (75): App(), expo, expo-status-bar, react-native-gesture-handler, AppLockGate(), formatWait(), LockScreen(), Mode (+67 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.31
Nodes (10): Phase 1 — MVP (must have), GroupedBarChart(), CategoryBarList(), categoryBreakdown(), KindBarList(), kindBreakdown(), Mode, ReportScreen() (+2 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "RADIUS"
Cohesion: 0.14
Nodes (12): @react-navigation/native, Props, styles, ProgressBarProps, styles, CATEGORY_EMOJIS, CATEGORY_LABELS, styles (+4 more)

### Community 21 - "ExpenseFormScreen.tsx"
Cohesion: 0.06
Nodes (81): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel (+73 more)

### Community 22 - "RootNavigator.tsx"
Cohesion: 0.22
Nodes (8): AssetsNavigator(), Stack, AssetsStackParamList, DebtNavigator(), GoalNavigator(), PassiveIncomeNavigator(), ReminderNavigator(), Stack

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "FONTS"
Cohesion: 0.15
Nodes (14): ButtonProps, styles, EmptyStateProps, styles, InputProps, styles, Props, styles (+6 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.26
Nodes (10): Stack, GoalDetailScreen(), Props, Row(), styles, NavProp, styles, GoalStackParamList (+2 more)

### Community 26 - "common/index.ts"
Cohesion: 0.13
Nodes (28): @hookform/resolvers, react-hook-form, zod, AssetSuccessAnimation(), DateInput(), Input, MoneyDropAnimation(), SavingSuccessAnimation() (+20 more)

### Community 27 - "ReminderListScreen.tsx"
Cohesion: 0.20
Nodes (14): Stack, Chip(), Props, ReminderFormScreen(), styles, toNumber(), NavProp, ReminderItem() (+6 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (16): main, name, private, version, babel-preset-expo, expo-dev-client, expo-document-picker, expo-file-system (+8 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "ReminderScheduler.ts"
Cohesion: 0.07
Nodes (51): dayjs, expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, migrateDebtsToV17(), NewExpense, OldDebt (+43 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 34 - "formatCurrency"
Cohesion: 0.12
Nodes (29): AmountDisplay(), AmountDisplayProps, sizes, styles, EmptyState(), FAB(), lighten(), DetailItem() (+21 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "constants/index.ts"
Cohesion: 0.20
Nodes (9): ASSET_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, Props, AssetCategory, InvestmentType (+1 more)

### Community 38 - "Card.tsx"
Cohesion: 0.32
Nodes (6): CardProps, styles, DevToolsScreen(), MenuItem(), styles, clearAllData()

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.12
Nodes (14): CurrencyInputProps, styles, buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE (+6 more)

### Community 41 - "budget.ts"
Cohesion: 0.22
Nodes (12): zustand, DEFAULT_SETTINGS, SettingsState, validTargets(), AppSettings, DEFAULT_KIND_TARGETS, KEPT_KINDS, KIND_META (+4 more)

### Community 42 - "ObligationsCard.tsx"
Cohesion: 0.50
Nodes (3): Props, Reminder, styles

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, @types/react, typescript

### Community 46 - "InvestmentFormScreen.tsx"
Cohesion: 0.14
Nodes (12): react-native-safe-area-context, Props, State, styles, Field(), fieldStyles, INVESTMENT_TYPES, NavProp (+4 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "react"
Cohesion: 0.13
Nodes (20): react, BackButtonProps, styles, styles, TYPE_EMOJIS, TYPE_LABELS, Stack, NavProp (+12 more)

### Community 52 - "Financial Freedom Level System — Implementation Plan"
Cohesion: 0.40
Nodes (4): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 2 — Nice to have, Phase 3 — Advanced (not planned)

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 514 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `BackButton`, `Text`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `navigation/types.ts`, `ActivityScreen.tsx`, `COLORS`, `theme/index.ts`, `AppProviders.tsx`, `ReportScreen.tsx`, `RADIUS`, `ExpenseFormScreen.tsx`, `RootNavigator.tsx`, `FONTS`, `GoalDetailScreen.tsx`, `common/index.ts`, `ReminderListScreen.tsx`, `package.json`, `formatCurrency`, `Card.tsx`, `PhysicalAssetFormScreen.tsx`, `ObligationsCard.tsx`, `InvestmentFormScreen.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `BackButton`, `Text`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `navigation/types.ts`, `ActivityScreen.tsx`, `COLORS`, `theme/index.ts`, `AppProviders.tsx`, `ReportScreen.tsx`, `RADIUS`, `ExpenseFormScreen.tsx`, `FONTS`, `GoalDetailScreen.tsx`, `common/index.ts`, `ReminderListScreen.tsx`, `package.json`, `formatCurrency`, `Card.tsx`, `PhysicalAssetFormScreen.tsx`, `ObligationsCard.tsx`, `InvestmentFormScreen.tsx`, `react`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._