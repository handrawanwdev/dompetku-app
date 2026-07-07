# Project Context — Dompetku

Personal finance manager app. Offline-first, dark theme, Indonesian locale.

---

## Stack

| Layer | Package | Version | Notes |
|-------|---------|---------|-------|
| Framework | React Native + Expo | 0.85.3 / ~56.0.12 | |
| Language | TypeScript | ~6.0.3 | strict mode |
| Database | RealmDB + @realm/react | ^20.2.0 / ^0.20.0 | offline-first |
| Navigation | React Navigation v7 | bottom-tabs + native-stack | |
| State | Zustand | ^5.0.14 | settings only |
| Storage | react-native-mmkv | ^4.3.2 | BREAKING: `createMMKV()` not `new MMKV()` |
| Forms | react-hook-form + zod + @hookform/resolvers | ^7 / ^4 / ^5 | |
| Charts | react-native-svg + victory-native | 15.15.4 / ^41 | custom DonutChart, SimpleBarChart |
| File I/O | expo-file-system | ~56.0.8 | BREAKING: class API — `new File(Paths.document, name)` |
| Dev Build | expo-dev-client | ~56.0.20 | needed for SDK 56, Expo Go incompatible |
| Date | dayjs | ^1.11.21 | Indonesian locale |

---

## Architecture

```
App.tsx
└── AppProviders.tsx
    ├── GestureHandlerRootView
    ├── SafeAreaProvider
    ├── RealmProvider (realmConfig)
    └── NavigationContainer
        └── MainTabNavigator (6 tabs)
            ├── Dashboard
            ├── Income      → IncomeNavigator
            ├── Expense     → ExpenseNavigator
            ├── Debt        → DebtNavigator
            ├── Assets      → AssetsTabNavigator
            │   ├── Savings     → SavingsNavigator
            │   ├── Investment  → InvestmentNavigator
            │   └── Assets      → AssetsNavigator (PhysicalAsset)
            └── Settings    → SettingsNavigator
                └── Goals   → GoalsNavigator (accessed from Settings)
```

---

## Realm Models (10 total)

| Model | Key Fields |
|-------|-----------|
| `IncomeModel` | amount, category, date, note, allocationDebt, allocationSavings, allocationCash |
| `ExpenseModel` | amount, category, date, note |
| `DebtModel` | name, totalAmount, remainingAmount, dueDate, interestRate, type |
| `DebtPaymentModel` | debtId, amount, date, note |
| `SavingModel` | name, targetAmount, currentAmount, targetDate, type |
| `SavingHistoryModel` | savingId, amount, date, note |
| `InvestmentModel` | name, type, amount, currentValue, purchaseDate |
| `PhysicalAssetModel` | name, type, purchaseValue, currentValue, purchaseDate |
| `GoalModel` | name, targetAmount, currentAmount, targetDate, priority |
| `CategoryModel` | name, type, color, icon |

`src/database/realm.ts` — `realmConfig = { schema: ALL_MODELS, schemaVersion: 1 }`

---

## Theme

`src/theme/index.ts`

**FONTS** — flat object (not nested):
```ts
FONTS.xs=10, FONTS.sm=12, FONTS.md=14, FONTS.lg=16, FONTS.xl=18, FONTS.xxl=24, FONTS.xxxl=32
```

**COLORS** key palette:
```ts
background: '#0F172A'   // dark navy
surface:    '#1E293B'
card:       '#243447'
primary:    '#4F46E5'   // indigo
income:     '#10B981'   // green
expense:    '#EF4444'   // red
debt:       '#F59E0B'   // amber
savings:    '#3B82F6'   // blue
investment: '#8B5CF6'   // purple
asset:      '#EC4899'   // pink
```

---

## Key Files

```
App.tsx                              entry, StatusBar style="light" (no backgroundColor)
src/app/AppProviders.tsx             all providers + navigation root
src/theme/index.ts                   COLORS, FONTS, SPACING, RADIUS
src/database/realm.ts                realmConfig
src/models/index.ts                  ALL_MODELS array
src/storage/mmkv.ts                  createMMKV({ id: 'dompetku-storage' })
src/store/settingsStore.ts           Zustand settings (currency, language, etc.)
src/services/BackupService.ts        JSON export/import via expo-file-system v56 class API
src/utils/currency.ts                formatRupiah()
src/utils/date.ts                    today(), formatDate()
src/utils/finance.ts                 finance helpers
src/constants/index.ts               app-wide constants
src/types/index.ts                   shared TypeScript types
```

---

## Known Breaking Changes (SDK 56)

### react-native-mmkv v4
```ts
// WRONG
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

// CORRECT
import { createMMKV } from 'react-native-mmkv';
export const storage = createMMKV({ id: 'dompetku-storage' });
```

### expo-file-system v56
```ts
// WRONG — legacy API removed
import * as FileSystem from 'expo-file-system';
FileSystem.documentDirectory + filename

// CORRECT — class API
import { File, Paths } from 'expo-file-system';
const file = new File(Paths.document, filename);
file.write(content);
const text = await file.text();
```

### expo-status-bar
```tsx
// WRONG — backgroundColor not supported
<StatusBar style="light" backgroundColor={COLORS.background} />

// CORRECT
<StatusBar style="light" />
```

### Zod v4 + react-hook-form resolver
`.transform()` on form fields causes type mismatch with resolver. Parse numbers in `onSubmit` instead — keep schema output as `string`.

### StyleProp vs TextStyle
Components accepting conditional styles must use `StyleProp<TextStyle>`, not `TextStyle`:
```ts
import { StyleProp, TextStyle } from 'react-native';
style?: StyleProp<TextStyle>;
```

---

## Build Options

See `docs/running-the-app.md` for full details.

| Method | Command | Requires |
|--------|---------|---------|
| EAS Preview APK | `eas build -p android --profile preview` | Expo account |
| EAS Dev Build | `eas build --profile development -p android` | Expo account |
| Dev Client run | `npx expo start --dev-client` | Dev build installed on device |
| Local build | `npx expo run:android` | Android SDK + USB device |

`eas.json` profiles: `development` (dev client), `preview` (APK), `production` (AAB).

---

## App Config

`app.json` — bundle ID: `com.dompetku.app`, EAS project ID: `4366cfcc-6f31-4c9f-b82c-59ed9319f69d`

Android adaptive icon uses:
- `./assets/android-icon-foreground.png`
- `./assets/android-icon-background.png`
- `./assets/android-icon-monochrome.png`

Plugins: `expo-sharing`, `expo-document-picker`
