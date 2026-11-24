# Graph Report - Dompetku  (2026-11-25)

## Corpus Check
- 173 files · ~203,563 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1134 nodes · 4012 edges · 57 communities (53 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24ac33cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TAD — ForgeOS Project
- DiagnosisScreen.tsx
- prd-phase-3-local-financial-ai-assistant.md
- budget.ts
- react
- @expo/vector-icons
- FONTS
- SPEC — ForgeOS Project
- expo
- BirthdaySurprise.tsx
- ProfileScreen.tsx
- BackButton
- ActivityScreen.tsx
- common/index.ts
- palettes.ts
- AppLockService.ts
- Text
- dependencies
- Project Context — Dompetku
- 9. Modules
- SPACING
- DataScreen.tsx
- AppLockGate.tsx
- dompetku-prd.md
- COLORS
- GoalDetailScreen.tsx
- ExpenseFormScreen.tsx
- ReminderListScreen.tsx
- Build Lokal — Android SDK Required
- package.json
- tsconfig.json
- useSettingsStore
- 5. Technology Stack
- MenuEditScreen.tsx
- formatCurrency
- 11. Data Models
- 12. Financial Calculations
- App.tsx
- Card
- 10. Dashboard Widgets
- PhysicalAssetFormScreen.tsx
- NetWorthCard.tsx
- AppProviders.tsx
- Income Module
- Settings Module
- theme/index.ts
- react-native-safe-area-context
- 15. Future Roadmap
- 2. Objectives
- AGENTS.md
- PassiveIncomeListScreen.tsx
- SettingsScreen.tsx
- Button
- scripts
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

## Communities (57 total, 4 thin omitted)

### Community 0 - "TAD — ForgeOS Project"
Cohesion: 0.11
Nodes (17): 10. Infrastructure, 11. Observability, 12. External Integrations, 13. Technology Stack, 14. Deployment Architecture, 15. Technical Decisions, 16. Architecture Constraints, 1. Architecture Overview (+9 more)

### Community 1 - "DiagnosisScreen.tsx"
Cohesion: 0.18
Nodes (17): expo-file-system, expo-sharing, DiagnosisScreen(), Row(), SOURCE_LABEL, styles, buildReportText(), clearErrorLogs() (+9 more)

### Community 2 - "prd-phase-3-local-financial-ai-assistant.md"
Cohesion: 0.04
Nodes (47): 10. Financial Score Explanation, 11. Recommendation Engine, 12. AI Financial Card, 13. Smart Financial Suggestion, 14. Data Model, 15. Service Architecture, 16. Main Flow, 17. Performance Requirement (+39 more)

### Community 3 - "budget.ts"
Cohesion: 0.06
Nodes (40): ASSET_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, GOAL_EMOJIS, INVESTMENT_TYPES, SAVING_EMOJIS, Props, EMOJI_OPTIONS (+32 more)

### Community 4 - "react"
Cohesion: 0.14
Nodes (12): react, AmountDisplayProps, sizes, styles, Props, styles, TextProps, variantStyles (+4 more)

### Community 5 - "@expo/vector-icons"
Cohesion: 0.10
Nodes (27): @expo/vector-icons, BackButtonProps, styles, ButtonProps, styles, CurrencyInputProps, styles, InvestmentSuccessAnimation() (+19 more)

### Community 6 - "FONTS"
Cohesion: 0.10
Nodes (29): styles, styles, DayEntry, styles, WEEKDAYS, Props, styles, Tone (+21 more)

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
Cohesion: 0.10
Nodes (29): @react-navigation/bottom-tabs, AVATAR_COLORS, AVATAR_EMOJIS, avatarColor(), FINANCIAL_FOCUS, MAX_FOCUS, ProfileAvatar(), styles (+21 more)

### Community 11 - "BackButton"
Cohesion: 0.22
Nodes (14): BackButton(), DebtNavigator(), Stack, DebtDetailScreen(), Props, Row(), styles, DebtItem() (+6 more)

### Community 12 - "ActivityScreen.tsx"
Cohesion: 0.15
Nodes (18): ActivityScreen(), DropdownPill(), expenseDelta(), OptionSheet(), PeriodFilter, periodRange(), PERIODS, Props (+10 more)

### Community 13 - "common/index.ts"
Cohesion: 0.13
Nodes (19): AssetMoveKind, CONFIG, Props, CONFIG, InvestmentMoveKind, Props, Coin(), COINS (+11 more)

### Community 14 - "palettes.ts"
Cohesion: 0.17
Nodes (11): berry, DEFAULT_THEME_ID, honey, lilac, mint, ocean, PALETTES, peach (+3 more)

### Community 15 - "AppLockService.ts"
Cohesion: 0.16
Nodes (19): Props, Step, STEPS, styles, TEXT, clearPin(), hashPin(), K (+11 more)

### Community 16 - "Text"
Cohesion: 0.28
Nodes (18): Text(), BirthdayCard(), BudgetSplitCard(), CashflowCalendarCard(), short(), Stat(), DebtRatioCard(), GoalsCard() (+10 more)

### Community 17 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, babel-preset-expo, dayjs, expo, expo-background-task, expo-dev-client, expo-document-picker, expo-file-system (+26 more)

### Community 18 - "Project Context — Dompetku"
Cohesion: 0.14
Nodes (13): App Config, Architecture, Build Options, expo-file-system v56, expo-status-bar, Key Files, Known Breaking Changes (SDK 56), Project Context — Dompetku (+5 more)

### Community 19 - "9. Modules"
Cohesion: 0.13
Nodes (15): 9. Modules, Dashboard, Dashboard Module, Debt Module, Expense Module, Features, Features, Features (+7 more)

### Community 20 - "SPACING"
Cohesion: 0.12
Nodes (15): @react-navigation/native, EmptyStateProps, styles, Props, State, styles, Props, styles (+7 more)

### Community 21 - "DataScreen.tsx"
Cohesion: 0.06
Nodes (68): Realm Models (10 total), dayjs, expo-notifications, realm, @realm/react, migrateDebtsToV17(), NewExpense, OldDebt (+60 more)

### Community 22 - "AppLockGate.tsx"
Cohesion: 0.23
Nodes (15): AppLockGate(), formatWait(), LockScreen(), Mode, styles, Key(), PinPad(), CategoriesScreen() (+7 more)

### Community 23 - "dompetku-prd.md"
Cohesion: 0.15
Nodes (12): 13. Offline First, 14. Performance Requirements, 16. Success Metrics, 1. Overview, 3. Product Goals, 4. Target Users, 6. Application Architecture, 7. Project Structure (+4 more)

### Community 24 - "COLORS"
Cohesion: 0.12
Nodes (19): react-native, react-native-reanimated, InputProps, styles, ProgressBarProps, styles, CANDLES, Props (+11 more)

### Community 25 - "GoalDetailScreen.tsx"
Cohesion: 0.23
Nodes (14): ProgressBar(), GoalNavigator(), Stack, GoalDetailScreen(), Props, Row(), styles, GoalItem() (+6 more)

### Community 26 - "ExpenseFormScreen.tsx"
Cohesion: 0.10
Nodes (33): @hookform/resolvers, react-hook-form, @react-navigation/native-stack, zod, SavingSuccessAnimation(), ExpenseFormScreen(), FormValues, NavProp (+25 more)

### Community 27 - "ReminderListScreen.tsx"
Cohesion: 0.12
Nodes (30): ReminderModel, ReminderRepeat, ReminderNavigator(), Stack, Chip(), Props, ReminderFormScreen(), styles (+22 more)

### Community 28 - "Build Lokal — Android SDK Required"
Cohesion: 0.20
Nodes (9): Build APK — EAS Build (Cloud, No SDK), Build Lokal — Android SDK Required, Development (Expo Go), EAS Build Profiles (eas.json), Error: JAVA_HOME is not set, Error: No Android connected device found, Error: PATH rusak / perintah tidak ditemukan, Error: spawn adb ENOENT (+1 more)

### Community 29 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, @types/react, typescript, main, name, private, version, babel-preset-expo (+11 more)

### Community 30 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 31 - "useSettingsStore"
Cohesion: 0.26
Nodes (10): react-native-mmkv, zustand, getSettings(), saveSettings(), storage, StorageKeys, DEFAULT_SETTINGS, useSettingsStore (+2 more)

### Community 32 - "5. Technology Stack"
Cohesion: 0.22
Nodes (9): 5. Technology Stack, Charts, Date, Forms, Framework, Local Database, Navigation, Secure Storage (+1 more)

### Community 33 - "MenuEditScreen.tsx"
Cohesion: 0.24
Nodes (12): IconBtn(), ItemHead(), MenuEditScreen(), styles, ALL_MENU_IDS, DEFAULT_MENU, MENU_ITEMS, MenuId (+4 more)

### Community 34 - "formatCurrency"
Cohesion: 0.19
Nodes (19): AmountDisplay(), PhysicalAssetSellScreen(), AccountDetailScreen(), Action(), InvestmentSellScreen(), ActiveTab, buildMonthOptions(), CashflowScreen() (+11 more)

### Community 35 - "11. Data Models"
Cohesion: 0.25
Nodes (8): 11. Data Models, Debt, Expense, Goal, Income, Investment, Physical Asset, Saving

### Community 36 - "12. Financial Calculations"
Cohesion: 0.29
Nodes (7): 12. Financial Calculations, Cash, Cashflow, Debt Ratio, Goal Progress, Net Worth, Savings

### Community 37 - "App.tsx"
Cohesion: 0.20
Nodes (6): App(), expo, expo-status-bar, react-native-gesture-handler, AppProviders(), ErrorBoundary

### Community 38 - "Card"
Cohesion: 0.18
Nodes (12): Card(), CardProps, styles, NavProp, Props, RoutePropT, styles, DevToolsScreen() (+4 more)

### Community 39 - "10. Dashboard Widgets"
Cohesion: 0.33
Nodes (6): 10. Dashboard Widgets, Cashflow, Financial Suggestion, Financial Summary, Goals, Reminder

### Community 40 - "PhysicalAssetFormScreen.tsx"
Cohesion: 0.06
Nodes (60): AssetSuccessAnimation(), CurrencyInput(), formatThousands(), DateInput(), Input, PurchaseToggle(), AssetsNavigator(), Stack (+52 more)

### Community 41 - "NetWorthCard.tsx"
Cohesion: 0.15
Nodes (10): buildCalendarDays(), DateInputProps, MONTH_NAMES, styles, WEEKDAYS, YEAR_RANGE, Props, styles (+2 more)

### Community 42 - "AppProviders.tsx"
Cohesion: 0.29
Nodes (10): AppInner(), navigationRef, navTheme, styles, useOpenFromNotification(), RootNavigator(), pauseAutoLock(), registerDebtReminderBackgroundTask() (+2 more)

### Community 43 - "Income Module"
Cohesion: 0.50
Nodes (4): Allocation, Features, Income Module, Metrics

### Community 44 - "Settings Module"
Cohesion: 0.50
Nodes (4): Backup, Categories, Parameters, Settings Module

### Community 45 - "theme/index.ts"
Cohesion: 0.25
Nodes (7): styles, ThemeScreen(), setThemeId(), Theme, THEME_ID, themeStorage, ThemeId

### Community 46 - "react-native-safe-area-context"
Cohesion: 0.27
Nodes (11): react-native-safe-area-context, AppLockScreen(), Row(), styles, PinFlowScreen(), authenticateBiometric(), DeviceAuthInfo, getDeviceAuthInfo() (+3 more)

### Community 47 - "15. Future Roadmap"
Cohesion: 0.67
Nodes (3): 15. Future Roadmap, Phase 2, Phase 3

### Community 48 - "2. Objectives"
Cohesion: 0.67
Nodes (3): 2. Objectives, Primary Objectives, Secondary Objectives

### Community 50 - "PassiveIncomeListScreen.tsx"
Cohesion: 0.06
Nodes (43): Dependency graph, Financial Freedom Level System — Implementation Plan, Phase 1 — MVP (must have), Phase 2 — Nice to have, Phase 3 — Advanced (not planned), react-native-svg, GroupedBarChart(), GroupedBarChartProps (+35 more)

### Community 51 - "SettingsScreen.tsx"
Cohesion: 0.31
Nodes (7): NotifPermissionBanner(), GROUPS, NOTIF_OPTIONS, Row(), SettingsScreen(), styles, isNotifOn()

### Community 52 - "Button"
Cohesion: 0.43
Nodes (6): Button(), HeroAction(), styles, WalletScreen(), PassiveIncomeFormScreen(), accountTypeMeta()

### Community 54 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

## Knowledge Gaps
- **7 isolated node(s):** `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen`, `react-native-screens`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 518 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DiagnosisScreen.tsx`, `budget.ts`, `@expo/vector-icons`, `FONTS`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `BackButton`, `ActivityScreen.tsx`, `common/index.ts`, `AppLockService.ts`, `Text`, `SPACING`, `DataScreen.tsx`, `AppLockGate.tsx`, `COLORS`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `ReminderListScreen.tsx`, `package.json`, `MenuEditScreen.tsx`, `formatCurrency`, `App.tsx`, `Card`, `PhysicalAssetFormScreen.tsx`, `NetWorthCard.tsx`, `AppProviders.tsx`, `theme/index.ts`, `react-native-safe-area-context`, `PassiveIncomeListScreen.tsx`, `SettingsScreen.tsx`, `Button`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `babel-preset-expo`, `expo-dev-client`, `expo-splash-screen` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TAD — ForgeOS Project` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `prd-phase-3-local-financial-ai-assistant.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `COLORS` connect `COLORS` to `DiagnosisScreen.tsx`, `budget.ts`, `react`, `@expo/vector-icons`, `FONTS`, `BirthdaySurprise.tsx`, `ProfileScreen.tsx`, `BackButton`, `ActivityScreen.tsx`, `common/index.ts`, `AppLockService.ts`, `Text`, `SPACING`, `DataScreen.tsx`, `AppLockGate.tsx`, `GoalDetailScreen.tsx`, `ExpenseFormScreen.tsx`, `ReminderListScreen.tsx`, `MenuEditScreen.tsx`, `formatCurrency`, `Card`, `PhysicalAssetFormScreen.tsx`, `NetWorthCard.tsx`, `AppProviders.tsx`, `theme/index.ts`, `react-native-safe-area-context`, `PassiveIncomeListScreen.tsx`, `SettingsScreen.tsx`, `Button`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `budget.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._