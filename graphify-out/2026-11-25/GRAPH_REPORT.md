# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 173 files · ~203,825 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1135 nodes · 4020 edges · 60 communities (56 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a7abdf8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- DiagnosisScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- types/index.ts
- react
- InvestmentFormScreen.tsx
- COLORS
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- ProfileScreen.tsx
- AccountDetailScreen.tsx
- ExpenseFormScreen.tsx
- common/index.ts
- palettes.ts
- AppLockGate.tsx
- ReportScreen.tsx
- dependencies
- Project Context — Dompetku
- 9. Modules
- PhysicalAssetFormScreen.tsx
- DataScreen.tsx
- debt.ts
- dompetku-prd.md
- ReminderScheduler.ts
- GoalDetailScreen.tsx
- IncomeFormScreen.tsx
- reminder.ts
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- budget.ts
- 5. Technology Stack
- Card
- Text
- 11. Data Models
- 12. Financial Calculations
- CategoryService.ts
- SPACING
- 10. Dashboard Widgets
- BackButton
- DateInput.tsx
- react-native-safe-area-context
- Income Module
- Settings Module
- AppProviders.tsx
- theme/index.ts
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- PassiveIncomeListScreen.tsx
- RootNavigator.tsx
- useRootNavigation
- RemindersSection.tsx
- scripts
- DebtReminderBackgroundTask.ts
- TransactionNavigator.tsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `Text()` - 101 edges
2. `react` - 100 edges
3. `COLORS` - 93 edges
4. `react-native` - 84 edges
5. `FONTS` - 72 edges
6. `SPACING` - 71 edges
7. `formatCurrency()` - 68 edges
8. `RADIUS` - 67 edges
9. `@expo/vector-icons` - 55 edges
10. `BackButton()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 — MVP (must have)` --references--> `DebtListScreen()`  [INFERRED]
  docs/upgrade-system-plan.md → src/modules/debt/screens/DebtListScreen.tsx
- `Phase 1 — MVP (must have)` --references--> `GroupedBarChart()`  [INFERRED]
  docs/upgrade-system-plan.md → src/components/charts/GroupedBarChart.tsx
- `Realm Models (10 total)` --references--> `CategoryModel`  [INFERRED]
  docs/project-context.md → src/models/CategoryModel.ts
- `Realm Models (10 total)` --references--> `DebtModel`  [INFERRED]
  docs/project-context.md → src/models/DebtModel.ts
- `Realm Models (10 total)` --references--> `ExpenseModel`  [INFERRED]
  docs/project-context.md → src/models/ExpenseModel.ts

## Import Cycles
- None detected.

## Communities (60 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "DiagnosisScreen.tsx"
Cohesion: 0.22
Nodes (15): DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs(), ErrorLogEntry, ErrorSource (+7 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "react"
Cohesion: 0.09
Nodes (33): @expo/vector-icons, react, react-native, AmountDisplayProps, sizes, styles, Props, styles (+25 more)

### Community 5 - "InvestmentFormScreen.tsx"
Cohesion: 0.12
Nodes (20): BackButtonProps, styles, CurrencyInputProps, styles, Stack, Props, styles, fieldStyles (+12 more)

### Community 6 - "COLORS"
Cohesion: 0.14
Nodes (14): react-native-reanimated, Props, styles, ProgressBarProps, styles, CANDLES, Props, styles (+6 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.09
Nodes (33): BirthdayRecap, buildBirthdayRecap(), closingLine(), BirthdaySurprise(), CAKE_HINTS, GIFT_HINTS, Stage, styles (+25 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.18
Nodes (18): AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles, birthdayLine() (+10 more)

### Community 11 - "AccountDetailScreen.tsx"
Cohesion: 0.14
Nodes (20): @react-navigation/native, @react-navigation/native-stack, DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles (+12 more)

### Community 12 - "ExpenseFormScreen.tsx"
Cohesion: 0.15
Nodes (19): SavingSuccessAnimation(), ExpenseFormScreen(), FormValues, NavProp, RouteType, schema, styles, CategoryFormScreen() (+11 more)

### Community 13 - "common/index.ts"
Cohesion: 0.13
Nodes (21): AssetMoveKind, AssetSuccessAnimation(), CONFIG, Props, CONFIG, InvestmentMoveKind, InvestmentSuccessAnimation(), Props (+13 more)

### Community 14 - "palettes.ts"
Cohesion: 0.17
Nodes (11): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, PALETTES, peach (+3 more)

### Community 15 - "AppLockGate.tsx"
Cohesion: 0.10
Nodes (47): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), KEYS, PinPad() (+39 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.10
Nodes (34): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+26 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.13
Nodes (19): PurchaseToggle(), AssetsNavigator(), Stack, CATEGORIES, Field(), fs, NavProp, PhysicalAssetFormScreen() (+11 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.09
Nodes (51): Realm Models (10 total), realm, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel, IncomeModel (+43 more)

### Community 22 - "debt.ts"
Cohesion: 0.15
Nodes (15): dayjs, migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig, ALL_MODELS, buildDebtInfos() (+7 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "ReminderScheduler.ts"
Cohesion: 0.30
Nodes (15): BillReminderInput, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBillReminders(), refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders() (+7 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.22
Nodes (16): ProgressBar(), GoalsCard(), useAccounts(), GoalNavigator(), Stack, GoalDetailScreen(), Props, Row() (+8 more)

### Community 26 - "IncomeFormScreen.tsx"
Cohesion: 0.11
Nodes (9): @hookform/resolvers, react-hook-form, zod, CATEGORIES, FormValues, NavProp, RouteType, schema (+1 more)

### Community 27 - "reminder.ts"
Cohesion: 0.25
Nodes (13): ReminderRepeat, dueStatus(), getReminderStatus(), paidStatus(), ReminderStatus, buildReminderInfo(), buildReminderInfos(), isRepeat() (+5 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.08
Nodes (24): App(), devDependencies, @types/react, typescript, main, name, private, version (+16 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "budget.ts"
Cohesion: 0.16
Nodes (18): zustand, Props, DAY_LABELS, ParametersScreen(), styles, toInputs(), DEFAULT_SETTINGS, SettingsState (+10 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "Card"
Cohesion: 0.21
Nodes (17): Card(), MainMenuCard(), styles, Tile(), IconBtn(), ItemHead(), MenuEditScreen(), styles (+9 more)

### Community 34 - "Text"
Cohesion: 0.10
Nodes (41): AmountDisplay(), Text(), DetailItem(), PhysicalAssetListScreen(), CashflowCalendarCard(), short(), Stat(), AccountDetailScreen() (+33 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "CategoryService.ts"
Cohesion: 0.15
Nodes (14): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, DataScreen(), Row() (+6 more)

### Community 38 - "SPACING"
Cohesion: 0.09
Nodes (21): @realm/react, ButtonProps, styles, CardProps, styles, EmptyStateProps, styles, InputProps (+13 more)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "BackButton"
Cohesion: 0.18
Nodes (30): BackButton(), Button(), CurrencyInput(), formatThousands(), DateInput(), Input, PhysicalAssetSellScreen(), DebtFormScreen() (+22 more)

### Community 41 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 42 - "react-native-safe-area-context"
Cohesion: 0.20
Nodes (9): react-native-safe-area-context, Props, State, styles, styles, MainTabNavigator(), Tab, TabIcon() (+1 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "AppProviders.tsx"
Cohesion: 0.18
Nodes (11): AppInner(), AppProviders(), navigationRef, navTheme, styles, useOpenFromNotification(), ErrorBoundary, RootNavigator() (+3 more)

### Community 46 - "theme/index.ts"
Cohesion: 0.25
Nodes (7): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, ThemeId

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.08
Nodes (35): EmptyState(), FAB(), lighten(), ReminderModel, InvestmentListScreen(), SummaryCol(), PassiveIncomeNavigator(), Stack (+27 more)

### Community 51 - "RootNavigator.tsx"
Cohesion: 0.15
Nodes (12): InvestmentNavigator(), DevToolsScreen(), MenuItem(), GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles (+4 more)

### Community 52 - "useRootNavigation"
Cohesion: 0.33
Nodes (8): AccountPicker(), Props, styles, HeroAction(), WalletScreen(), useRootNavigation(), accountLabel(), accountTypeMeta()

### Community 53 - "RemindersSection.tsx"
Cohesion: 0.17
Nodes (10): Props, Reminder, styles, Props, Reminder, styles, Props, Reminder (+2 more)

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 55 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.20
Nodes (8): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, LEGACY_TASK_NAMES, saveSettings(), storage, StorageKeys

### Community 56 - "TransactionNavigator.tsx"
Cohesion: 0.50
Nodes (3): Stack, TransactionNavigator(), CashflowStackParamList

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 518 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DiagnosisScreen.tsx`, `InvestmentFormScreen.tsx`, `COLORS`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `AccountDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `common/index.ts`, `AppLockGate.tsx`, `ReportScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `DataScreen.tsx`, `GoalDetailScreen.tsx`, `IncomeFormScreen.tsx`, `package.json`, `budget.ts`, `Card`, `Text`, `SPACING`, `BackButton`, `DateInput.tsx`, `react-native-safe-area-context`, `AppProviders.tsx`, `theme/index.ts`, `PassiveIncomeListScreen.tsx`, `RootNavigator.tsx`, `useRootNavigation`, `RemindersSection.tsx`, `TransactionNavigator.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react` to `DiagnosisScreen.tsx`, `InvestmentFormScreen.tsx`, `COLORS`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `AccountDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `common/index.ts`, `AppLockGate.tsx`, `ReportScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `DataScreen.tsx`, `GoalDetailScreen.tsx`, `IncomeFormScreen.tsx`, `package.json`, `budget.ts`, `Card`, `Text`, `SPACING`, `BackButton`, `DateInput.tsx`, `react-native-safe-area-context`, `AppProviders.tsx`, `theme/index.ts`, `PassiveIncomeListScreen.tsx`, `RootNavigator.tsx`, `useRootNavigation`, `RemindersSection.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._