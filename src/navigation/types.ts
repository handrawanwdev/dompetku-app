import { useNavigation, type NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SpendKind } from '../utils/budget';
import type { DebtStackParamList } from '../modules/debt/types';
import type { GoalStackParamList } from '../modules/goal/types';
import type { ReminderStackParamList } from '../modules/reminder/types';

export type MainTabParamList = {
  Dashboard: undefined;
  Transaction: undefined;
  Wallet: undefined;
  Profile: undefined;
};

/** Halaman di atas tab bar. Bisa dibuka dari mana saja (dashboard, menu, profil). */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Debts: NavigatorScreenParams<DebtStackParamList> | undefined;
  Goals: NavigatorScreenParams<GoalStackParamList> | undefined;
  Reminders: NavigatorScreenParams<ReminderStackParamList> | undefined;
  Investments: undefined;
  Assets: undefined;
  IncomeForm: { id?: string };
  ExpenseForm: {
    id?: string;
    kind?: SpendKind;
    debtId?: string;
    category?: string;
    goalId?: string;
    fromSavings?: boolean;
    /** Dibuka dari pengingat tagihan: prefill + tandai periode ini lunas saat disimpan. */
    billId?: string;
    billPeriod?: string;
  };
  Report: undefined;
  Recurring: undefined;
  Theme: undefined;
  Categories: undefined;
  CategoryForm: { type: 'income' | 'expense'; id?: string };
  Parameters: undefined;
  Data: undefined;
  Diagnosis: undefined;
  DevTools: undefined;
  MenuEdit: undefined;
  Settings: undefined;
  ProfileEdit: undefined;
  AppLock: undefined;
  PinFlow: { mode: 'create' | 'change' | 'disable' };
  AccountForm: { id?: string; savings?: boolean };
  AccountDetail: { id: string };
  TransferForm: { id?: string; fromId?: string; toId?: string };
  Activity: undefined;
  FreedomLevel: undefined;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

/** Navigasi ke halaman root dari layar mana pun (aksi navigate naik ke root stack). */
export function useRootNavigation() {
  return useNavigation<RootNavigation>();
}
