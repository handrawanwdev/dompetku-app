# Graph Report - Dompetku  (2026-11-24)

## Corpus Check
- 144 files · ~185,266 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 939 nodes · 3109 edges · 45 communities (40 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82ef5cb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- AccountDetailScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- GoalListScreen.tsx
- common/index.ts
- Text
- SPEC — ForgeOS Project
- expo
- react-native-safe-area-context
- ParametersScreen.tsx
- COLORS
- DebtReminderBackgroundTask.ts
- theme/index.ts
- RootNavigator.tsx
- NotificationService.ts
- CashflowScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- DiagnosisScreen.tsx
- useDashboardData.ts
- AppProviders.tsx
- dompetku-prd.md
- ErrorBoundary
- ICON_SIZES
- ProfileScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- scripts
- 5. Technology Stack
- PhysicalAssetListScreen.tsx
- react
- 11. Data Models
- 12. Financial Calculations
- 10. Dashboard Widgets
- Income Module
- Settings Module
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 80 edges
2. `COLORS` - 75 edges
3. `Text()` - 70 edges
4. `react-native` - 66 edges
5. `FONTS` - 59 edges
6. `formatCurrency()` - 57 edges
7. `SPACING` - 56 edges
8. `RADIUS` - 54 edges
9. `Card()` - 44 edges
10. `@expo/vector-icons` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Realm Models (10 total)` --references--> `GoalModel`  [INFERRED]
  docs/project-context.md → src/models/GoalModel.ts
- `Realm Models (10 total)` --references--> `InvestmentModel`  [INFERRED]
  docs/project-context.md → src/models/InvestmentModel.ts
- `Phase 1 — MVP (must have)` --references--> `DashboardScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/dashboard/DashboardScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx

## Import Cycles
- None detected.

## Communities (45 total, 5 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "AccountDetailScreen.tsx"
Cohesion: 0.12
Nodes (13): AccountDetailScreen(), Action(), Props, Row, styles, ActivityScreen(), expenseDelta(), Props (+5 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.06
Nodes (39): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, migrateDebtsToV17(), NewExpense (+31 more)

### Community 4 - "GoalListScreen.tsx"
Cohesion: 0.16
Nodes (16): GoalModel, Stack, GoalItem(), GoalListScreen(), NavProp, styles, GoalStackParamList, useGoals() (+8 more)

### Community 5 - "common/index.ts"
Cohesion: 0.06
Nodes (85): @hookform/resolvers, react-hook-form, react-native-reanimated, zod, AmountDisplay(), AmountDisplayProps, sizes, styles (+77 more)

### Community 6 - "Text"
Cohesion: 0.15
Nodes (31): Card(), Text(), BudgetSplitCard(), CashflowCalendarCard(), DailyTotals, Props, short(), Stat() (+23 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "react-native-safe-area-context"
Cohesion: 0.15
Nodes (21): react-native-safe-area-context, ProgressBar(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtItem() (+13 more)

### Community 10 - "ParametersScreen.tsx"
Cohesion: 0.22
Nodes (14): DAY_LABELS, ParametersScreen(), styles, toInputs(), getSettings(), saveSettings(), DEFAULT_SETTINGS, SettingsState (+6 more)

### Community 11 - "COLORS"
Cohesion: 0.07
Nodes (41): react-native, ButtonProps, styles, CardProps, styles, buildCalendarDays(), DateInputProps, MONTH_NAMES (+33 more)

### Community 12 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.22
Nodes (7): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, LEGACY_TASK_NAMES, storage, StorageKeys

### Community 13 - "theme/index.ts"
Cohesion: 0.14
Nodes (15): styles, ThemeScreen(), ColorKey, setThemeId(), Theme, THEME_ID, themeStorage, berry (+7 more)

### Community 14 - "RootNavigator.tsx"
Cohesion: 0.11
Nodes (23): AssetsNavigator(), Stack, IconBtn(), ItemHead(), MenuEditScreen(), styles, DebtNavigator(), InvestmentNavigator() (+15 more)

### Community 15 - "NotificationService.ts"
Cohesion: 0.43
Nodes (7): cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders(), scheduleAt()

### Community 16 - "CashflowScreen.tsx"
Cohesion: 0.11
Nodes (29): Props, styles, CategoriesScreen(), CategoryType, styles, CategoryFormScreen(), EMOJI_OPTIONS, Props (+21 more)

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
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 21 - "useDashboardData.ts"
Cohesion: 0.07
Nodes (70): Realm Models (10 total), dayjs, @react-navigation/native, realm, @realm/react, AccountModel, CategoryModel, DebtModel (+62 more)

### Community 22 - "AppProviders.tsx"
Cohesion: 0.22
Nodes (12): App(), expo, expo-status-bar, react-native-gesture-handler, AppInner(), AppProviders(), navTheme, styles (+4 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 25 - "ICON_SIZES"
Cohesion: 0.29
Nodes (6): Props, styles, Tone, Props, styles, ICON_SIZES

### Community 26 - "ProfileScreen.tsx"
Cohesion: 0.16
Nodes (17): @react-navigation/bottom-tabs, BirthdayCard(), styles, GROUPS, ProfileScreen(), Row(), styles, MainTabNavigator() (+9 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (15): devDependencies, @types/react, typescript, main, name, private, version, babel-preset-expo (+7 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "PhysicalAssetListScreen.tsx"
Cohesion: 0.11
Nodes (26): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+18 more)

### Community 34 - "react"
Cohesion: 0.07
Nodes (41): expo-linear-gradient, @expo/vector-icons, react, @react-navigation/native-stack, BackButtonProps, styles, CurrencyInputProps, formatThousands() (+33 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 463 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `PhysicalAssetListScreen.tsx`, `AccountDetailScreen.tsx`, `GoalListScreen.tsx`, `common/index.ts`, `Text`, `react-native-safe-area-context`, `ParametersScreen.tsx`, `COLORS`, `theme/index.ts`, `RootNavigator.tsx`, `CashflowScreen.tsx`, `DiagnosisScreen.tsx`, `useDashboardData.ts`, `AppProviders.tsx`, `ICON_SIZES`, `ProfileScreen.tsx`, `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `AccountDetailScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `COLORS` to `PhysicalAssetListScreen.tsx`, `react`, `AccountDetailScreen.tsx`, `GoalListScreen.tsx`, `common/index.ts`, `Text`, `react-native-safe-area-context`, `ParametersScreen.tsx`, `theme/index.ts`, `RootNavigator.tsx`, `CashflowScreen.tsx`, `DiagnosisScreen.tsx`, `useDashboardData.ts`, `AppProviders.tsx`, `ICON_SIZES`, `ProfileScreen.tsx`, `package.json`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._