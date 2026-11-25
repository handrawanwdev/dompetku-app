# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 173 files · ~203,908 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1136 nodes · 4022 edges · 60 communities (56 shown, 4 thin omitted)
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
- react-native
- InvestmentFormScreen.tsx
- SPACING
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- ProfileScreen.tsx
- formatCurrency
- PassiveIncomeListScreen.tsx
- COLORS
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
- ExpenseFormScreen.tsx
- budget.ts
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- useSettingsStore
- 5. Technology Stack
- MenuEditScreen.tsx
- Text
- 11. Data Models
- 12. Financial Calculations
- CategoriesScreen.tsx
- PassiveIncomeFormScreen.tsx
- 10. Dashboard Widgets
- BackButton
- DateInput.tsx
- FONTS
- Income Module
- Settings Module
- AppProviders.tsx
- theme/index.ts
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- ReminderListScreen.tsx
- SettingsScreen.tsx
- ActivityScreen.tsx
- react
- scripts
- DebtReminderBackgroundTask.ts
- constants/index.ts
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

## Communities (60 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "DiagnosisScreen.tsx"
Cohesion: 0.18
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "types/index.ts"
Cohesion: 0.12
Nodes (16): Category, DashboardSummary, Debt, DebtPayment, Expense, ExpenseCategory, ExpenseSource, Goal (+8 more)

### Community 4 - "react-native"
Cohesion: 0.07
Nodes (35): @expo/vector-icons, react-native, InputProps, styles, ProgressBarProps, styles, Icon, styles (+27 more)

### Community 5 - "InvestmentFormScreen.tsx"
Cohesion: 0.10
Nodes (24): BackButtonProps, styles, ButtonProps, styles, CurrencyInputProps, styles, Props, styles (+16 more)

### Community 6 - "SPACING"
Cohesion: 0.14
Nodes (12): EmptyStateProps, styles, Props, styles, AssetsStackParamList, CATEGORY_EMOJIS, CATEGORY_LABELS, styles (+4 more)

### Community 7 - "SPEC — ForgeOS Project"
Cohesion: 0.17
Nodes (11): 10. Open Questions, 1. Overview, 2. Goals, 3. Actors, 4. Requirements, 5. Domain, 6. Capabilities, 7. Business Flows (+3 more)

### Community 8 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, blockedPermissions, package, predictiveBackGestureEnabled (+17 more)

### Community 9 - "BirthdaySurprise.tsx"
Cohesion: 0.08
Nodes (36): react-native-reanimated, BirthdayRecap, buildBirthdayRecap(), closingLine(), BirthdaySurprise(), CAKE_HINTS, GIFT_HINTS, Stage (+28 more)

### Community 10 - "ProfileScreen.tsx"
Cohesion: 0.17
Nodes (20): AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles, birthdayLine() (+12 more)

### Community 11 - "formatCurrency"
Cohesion: 0.22
Nodes (16): ProgressBar(), DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtItem() (+8 more)

### Community 12 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.10
Nodes (18): FAB(), lighten(), InvestmentListScreen(), SummaryCol(), PassiveIncomeNavigator(), Stack, categoryMeta(), PassiveIncomeListScreen() (+10 more)

### Community 13 - "COLORS"
Cohesion: 0.13
Nodes (20): AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, Coin(), COINS (+12 more)

### Community 14 - "palettes.ts"
Cohesion: 0.18
Nodes (10): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, peach, rose (+2 more)

### Community 15 - "AppLockGate.tsx"
Cohesion: 0.10
Nodes (46): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), KEYS, PinPad() (+38 more)

### Community 16 - "ReportScreen.tsx"
Cohesion: 0.13
Nodes (20): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+12 more)

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
Cohesion: 0.14
Nodes (18): AssetSuccessAnimation(), PurchaseToggle(), AssetsNavigator(), Stack, CATEGORIES, Field(), fs, NavProp (+10 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.08
Nodes (59): Realm Models (10 total), realm, @realm/react, AccountModel, CategoryModel, DebtModel, ExpenseModel, GoalModel (+51 more)

### Community 22 - "debt.ts"
Cohesion: 0.14
Nodes (16): dayjs, migrateDebtsToV17(), NewExpense, OldDebt, OldPayment, realmConfig, ALL_MODELS, buildDebtInfos() (+8 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "ReminderScheduler.ts"
Cohesion: 0.30
Nodes (15): BillReminderInput, cancelByPrefix(), DAILY_REMINDER_HOURS, DebtReminderInput, refreshBillReminders(), refreshBirthdayReminders(), refreshDailyReminders(), refreshDebtReminders() (+7 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.15
Nodes (21): GoalNavigator(), Stack, GoalDetailScreen(), Props, Row(), styles, GoalItem(), GoalListScreen() (+13 more)

### Community 26 - "ExpenseFormScreen.tsx"
Cohesion: 0.10
Nodes (27): @hookform/resolvers, react-hook-form, @react-navigation/native, @react-navigation/native-stack, zod, TransactionSuccessAnimation(), FormValues, NavProp (+19 more)

### Community 27 - "budget.ts"
Cohesion: 0.33
Nodes (7): Props, styles, KEPT_KINDS, KIND_META, LEGACY_KIND, SPEND_KINDS, SpendKind

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.09
Nodes (23): App(), devDependencies, @types/react, typescript, main, name, private, version (+15 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "useSettingsStore"
Cohesion: 0.23
Nodes (13): DAY_LABELS, ParametersScreen(), styles, toInputs(), saveSettings(), DEFAULT_SETTINGS, SettingsState, useSettingsStore (+5 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "MenuEditScreen.tsx"
Cohesion: 0.23
Nodes (13): styles, IconBtn(), ItemHead(), MenuEditScreen(), styles, ALL_MENU_IDS, DEFAULT_MENU, MENU_ITEMS (+5 more)

### Community 34 - "Text"
Cohesion: 0.10
Nodes (48): AmountDisplay(), Card(), Text(), BirthdayCard(), BudgetSplitCard(), CashflowCalendarCard(), DayEntry, short() (+40 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "CategoriesScreen.tsx"
Cohesion: 0.18
Nodes (14): DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, CategoriesScreen(), CategoryType, styles, DataScreen(), Row(), ensureDefaultExpenseCategories() (+6 more)

### Community 38 - "PassiveIncomeFormScreen.tsx"
Cohesion: 0.22
Nodes (7): CardProps, styles, NavProp, Props, RoutePropT, styles, PASSIVE_INCOME_FREQUENCIES

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "BackButton"
Cohesion: 0.22
Nodes (28): BackButton(), Button(), CurrencyInput(), formatThousands(), DateInput(), Input, InvestmentSuccessAnimation(), PhysicalAssetSellScreen() (+20 more)

### Community 41 - "DateInput.tsx"
Cohesion: 0.29
Nodes (6): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE

### Community 42 - "FONTS"
Cohesion: 0.13
Nodes (14): react-native-safe-area-context, AmountDisplayProps, sizes, styles, Props, State, styles, styles (+6 more)

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
Cohesion: 0.24
Nodes (8): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, PALETTES, ThemeId

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "ReminderListScreen.tsx"
Cohesion: 0.11
Nodes (30): EmptyState(), ReminderModel, ReminderRepeat, NotifPermissionBanner(), ReminderNavigator(), Stack, Chip(), Props (+22 more)

### Community 51 - "SettingsScreen.tsx"
Cohesion: 0.28
Nodes (7): GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, isNotifOn(), NotifSettingKey

### Community 52 - "ActivityScreen.tsx"
Cohesion: 0.14
Nodes (20): AccountDetailScreen(), ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS (+12 more)

### Community 53 - "react"
Cohesion: 0.29
Nodes (6): react, Props, styles, TextProps, variantStyles, weightMap

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 55 - "DebtReminderBackgroundTask.ts"
Cohesion: 0.22
Nodes (7): expo-background-task, expo-notifications, expo-task-manager, react-native-mmkv, LEGACY_TASK_NAMES, storage, StorageKeys

### Community 56 - "constants/index.ts"
Cohesion: 0.29
Nodes (6): ASSET_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, AssetCategory, InvestmentType

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 518 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DiagnosisScreen.tsx`, `react-native`, `InvestmentFormScreen.tsx`, `SPACING`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `formatCurrency`, `PassiveIncomeListScreen.tsx`, `COLORS`, `AppLockGate.tsx`, `ReportScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `DataScreen.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `budget.ts`, `package.json`, `useSettingsStore`, `MenuEditScreen.tsx`, `Text`, `CategoriesScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `BackButton`, `DateInput.tsx`, `FONTS`, `AppProviders.tsx`, `theme/index.ts`, `ReminderListScreen.tsx`, `SettingsScreen.tsx`, `ActivityScreen.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `DiagnosisScreen.tsx`, `InvestmentFormScreen.tsx`, `SPACING`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `formatCurrency`, `PassiveIncomeListScreen.tsx`, `COLORS`, `AppLockGate.tsx`, `ReportScreen.tsx`, `PhysicalAssetFormScreen.tsx`, `DataScreen.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `budget.ts`, `package.json`, `useSettingsStore`, `MenuEditScreen.tsx`, `Text`, `CategoriesScreen.tsx`, `PassiveIncomeFormScreen.tsx`, `BackButton`, `DateInput.tsx`, `FONTS`, `AppProviders.tsx`, `theme/index.ts`, `ReminderListScreen.tsx`, `SettingsScreen.tsx`, `ActivityScreen.tsx`, `react`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._