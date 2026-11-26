import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme';
import type { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { IncomeFormScreen } from '../modules/income/screens/IncomeFormScreen';
import { ExpenseFormScreen } from '../modules/expense/screens/ExpenseFormScreen';
import { ReportScreen } from '../modules/transaction/screens/ReportScreen';
import { PassiveIncomeNavigator } from '../modules/passiveIncome/PassiveIncomeNavigator';
import { ThemeScreen } from '../modules/settings/screens/ThemeScreen';
import { CategoriesScreen } from '../modules/settings/screens/CategoriesScreen';
import { CategoryFormScreen } from '../modules/settings/screens/CategoryFormScreen';
import { ParametersScreen } from '../modules/settings/screens/ParametersScreen';
import { DataScreen } from '../modules/settings/screens/DataScreen';
import { DiagnosisScreen } from '../modules/settings/screens/DiagnosisScreen';
import { DevToolsScreen } from '../modules/settings/screens/DevToolsScreen';
import { MenuEditScreen } from '../modules/dashboard/screens/MenuEditScreen';
import { SettingsScreen } from '../modules/settings/screens/SettingsScreen';
import { ProfileEditScreen } from '../modules/settings/screens/ProfileEditScreen';
import { AppLockScreen } from '../modules/settings/screens/AppLockScreen';
import { PinFlowScreen } from '../modules/settings/screens/PinFlowScreen';
import { DebtNavigator } from '../modules/debt/DebtNavigator';
import { GoalNavigator } from '../modules/goal/GoalNavigator';
import { ReminderNavigator } from '../modules/reminder/ReminderNavigator';
import { InvestmentNavigator } from '../modules/investment/InvestmentNavigator';
import { AssetsNavigator } from '../modules/assets/AssetsNavigator';
import { AccountFormScreen } from '../modules/finance/screens/AccountFormScreen';
import { AccountDetailScreen } from '../modules/finance/screens/AccountDetailScreen';
import { TransferFormScreen } from '../modules/finance/screens/TransferFormScreen';
import { ActivityScreen } from '../modules/finance/screens/ActivityScreen';
import { FreedomLevelScreen } from '../modules/freedom/FreedomLevelScreen';
import { SHOW_INVESTMENT_AND_ASSETS } from './menu';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
        headerTitle: '',
        headerBackTitle: 'Kembali',
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="IncomeForm" component={IncomeFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Recurring" component={PassiveIncomeNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Debts" component={DebtNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Goals" component={GoalNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Reminders" component={ReminderNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AccountForm" component={AccountFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TransferForm" component={TransferFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FreedomLevel" component={FreedomLevelScreen} options={{ headerShown: false }} />
      {SHOW_INVESTMENT_AND_ASSETS && (
        <>
          <Stack.Screen name="Investments" component={InvestmentNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Assets" component={AssetsNavigator} options={{ headerShown: false }} />
        </>
      )}
      <Stack.Screen name="Report" component={ReportScreen} options={{ headerTitle: 'Rekap' }} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={{ headerTitle: 'Tambah kategori', presentation: 'modal' }}
      />
      <Stack.Screen name="Parameters" component={ParametersScreen} />
      <Stack.Screen name="Data" component={DataScreen} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
      <Stack.Screen name="MenuEdit" component={MenuEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="AppLock" component={AppLockScreen} />
      <Stack.Screen name="PinFlow" component={PinFlowScreen} />
      {__DEV__ && <Stack.Screen name="DevTools" component={DevToolsScreen} />}
    </Stack.Navigator>
  );
}
