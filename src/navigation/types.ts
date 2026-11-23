import { useNavigation, type NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SpendKind } from '../utils/budget';
import type { DebtStackParamList } from '../modules/debt/types';

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
  Investments: undefined;
  Assets: undefined;
  IncomeForm: { id?: string };
  ExpenseForm: { id?: string; kind?: SpendKind; debtId?: string; category?: string };
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
  AccountForm: { id?: string; savings?: boolean };
  AccountDetail: { id: string };
  TransferForm: { id?: string; fromId?: string; toId?: string };
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

/** Navigasi ke halaman root dari layar mana pun (aksi navigate naik ke root stack). */
export function useRootNavigation() {
  return useNavigation<RootNavigation>();
}
