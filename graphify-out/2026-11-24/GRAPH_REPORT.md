# Graph Report - Dompetku  (2026-11-24)

## Corpus Check
- 135 files · ~180,208 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 883 nodes · 2810 edges · 48 communities (44 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7906f929`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- PhysicalAssetListScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- constants/index.ts
- formatCurrency
- RootNavigator.tsx
- SPEC — ForgeOS Project
- expo
- DebtDetailScreen.tsx
- CashflowScreen.tsx
- Text
- react
- theme/index.ts
- dayjs
- COLORS
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- ExpenseFormScreen.tsx
- AppProviders.tsx
- dompetku-prd.md
- RemindersSection.tsx
- WalletScreen.tsx
- CategoriesScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- scripts
- 5. Technology Stack
- ErrorBoundary.tsx
- NotificationService.ts
- 11. Data Models
- 12. Financial Calculations
- SPACING
- 10. Dashboard Widgets
- budget.ts
- TransactionNavigator.tsx
- devDependencies
- Income Module
- Settings Module
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 75 edges
2. `COLORS` - 71 edges
3. `react-native` - 63 edges
4. `Text()` - 62 edges
5. `FONTS` - 56 edges
6. `SPACING` - 53 edges
7. `formatCurrency()` - 52 edges
8. `RADIUS` - 50 edges
9. `Card()` - 44 edges
10. `@expo/vector-icons` - 36 edges

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

## Communities (48 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.08
Nodes (32): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), expo-linear-gradient, react-native-svg, GroupedBarChart() (+24 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "constants/index.ts"
Cohesion: 0.20
Nodes (9): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, Props, AssetCategory, InvestmentType (+1 more)

### Community 5 - "formatCurrency"
Cohesion: 0.05
Nodes (79): @react-navigation/native-stack, AssetSuccessAnimation(), BackButton(), BackButtonProps, styles, Button(), ButtonProps, styles (+71 more)

### Community 6 - "RootNavigator.tsx"
Cohesion: 0.07
Nodes (40): react-native-safe-area-context, zustand, CardProps, styles, AssetsNavigator(), IconBtn(), ItemHead(), MenuEditScreen() (+32 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+16 more)

### Community 9 - "DebtDetailScreen.tsx"
Cohesion: 0.14
Nodes (20): ProgressBar(), DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtItem() (+12 more)

### Community 10 - "CashflowScreen.tsx"
Cohesion: 0.22
Nodes (14): AmountDisplay(), ActiveTab, buildMonthOptions(), CashflowScreen(), CategoryFilter(), CategoryOption, ExpenseItem(), INCOME_EMOJIS (+6 more)

### Community 11 - "Text"
Cohesion: 0.21
Nodes (25): Card(), Text(), BirthdayCard(), BudgetSplitCard(), CashflowCalendarCard(), Props, short(), styles (+17 more)

### Community 12 - "react"
Cohesion: 0.13
Nodes (21): react, AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, Coin() (+13 more)

### Community 13 - "theme/index.ts"
Cohesion: 0.14
Nodes (15): styles, ThemeScreen(), ColorKey, setThemeId(), Theme, THEME_ID, themeStorage, berry (+7 more)

### Community 14 - "dayjs"
Cohesion: 0.40
Nodes (5): dayjs, BirthdayInfo, birthdayInYear(), getBirthdayInfo(), WISHES

### Community 16 - "COLORS"
Cohesion: 0.09
Nodes (25): react-native, AmountDisplayProps, sizes, styles, buildCalendarDays(), DateInputProps, MONTH_NAMES, styles (+17 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+24 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "DiagnosisScreen.tsx"
Cohesion: 0.18
Nodes (17): expo-sharing, react-native-mmkv, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 21 - "ExpenseFormScreen.tsx"
Cohesion: 0.07
Nodes (72): Realm Models (10 total), @hookform/resolvers, react-hook-form, realm, @realm/react, zod, Input, AccountModel (+64 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.20
Nodes (13): expo-background-task, expo-task-manager, AppInner(), AppProviders(), navTheme, styles, realmConfig, RootNavigator() (+5 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 25 - "RemindersSection.tsx"
Cohesion: 0.25
Nodes (7): Props, Reminder, styles, Props, Reminder, styles, ReminderStatus

### Community 26 - "WalletScreen.tsx"
Cohesion: 0.29
Nodes (8): HeroAction(), styles, WalletScreen(), MainTabNavigator(), Tab, TabIcon(), tabStyles, addAdjustment()

### Community 27 - "CategoriesScreen.tsx"
Cohesion: 0.16
Nodes (15): @react-navigation/native, DEFAULT_INCOME_CATEGORIES, CategoriesScreen(), CategoryType, styles, CategoryFormScreen(), EMOJI_OPTIONS, Props (+7 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.11
Nodes (18): App(), main, name, private, version, babel-preset-expo, expo, expo-dev-client (+10 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "ErrorBoundary.tsx"
Cohesion: 0.22
Nodes (4): ErrorBoundary, Props, State, styles

### Community 34 - "NotificationService.ts"
Cohesion: 0.39
Nodes (7): expo-notifications, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshDailyReminders(), refreshDebtReminders(), scheduleAt()

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "SPACING"
Cohesion: 0.12
Nodes (19): @expo/vector-icons, Props, styles, styles, Props, styles, Tone, Props (+11 more)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "budget.ts"
Cohesion: 0.18
Nodes (15): migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, ALL_MODELS, DataScreen(), Row(), ensureDefaultExpenseCategories() (+7 more)

### Community 41 - "TransactionNavigator.tsx"
Cohesion: 0.50
Nodes (3): Stack, TransactionNavigator(), CashflowStackParamList

### Community 42 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, @types/react, typescript

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
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 450 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `PhysicalAssetListScreen.tsx`, `ErrorBoundary.tsx`, `formatCurrency`, `RootNavigator.tsx`, `SPACING`, `DebtDetailScreen.tsx`, `CashflowScreen.tsx`, `Text`, `TransactionNavigator.tsx`, `theme/index.ts`, `COLORS`, `DiagnosisScreen.tsx`, `ExpenseFormScreen.tsx`, `AppProviders.tsx`, `RemindersSection.tsx`, `WalletScreen.tsx`, `CategoriesScreen.tsx`, `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `PhysicalAssetListScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08108108108108109 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `COLORS` to `PhysicalAssetListScreen.tsx`, `ErrorBoundary.tsx`, `formatCurrency`, `RootNavigator.tsx`, `SPACING`, `DebtDetailScreen.tsx`, `CashflowScreen.tsx`, `Text`, `react`, `theme/index.ts`, `DiagnosisScreen.tsx`, `ExpenseFormScreen.tsx`, `AppProviders.tsx`, `RemindersSection.tsx`, `WalletScreen.tsx`, `CategoriesScreen.tsx`, `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._