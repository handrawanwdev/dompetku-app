import { useEffect, useMemo, useState } from "react";
import { useQuery, useRealm } from "@realm/react";
import dayjs from "dayjs";

import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { InvestmentModel } from "../../../models/InvestmentModel";
import { PhysicalAssetModel } from "../../../models/PhysicalAssetModel";
import { PassiveIncomeModel } from "../../../models/PassiveIncomeModel";
import { startOfMonth, endOfMonth } from "../../../utils/date";
import { calcDepreciation } from "../../../utils/finance";
import { getReminderStatus } from "../../../utils/debt";
import { useDebts } from "../../debt/useDebts";
import { useSettingsStore } from "../../../store/settingsStore";
import { isSpendKind, type SpendKind } from "../../../utils/budget";
import { refreshAllReminders } from "../../../services/ReminderScheduler";
import { useReminders } from "../../reminder/useReminders";
import type { DueItem } from "../../../utils/reminder";
import { getBalances, getUntrackedInvestment } from "../../../services/AllocationService";
import { runPassiveIncomeSchedule } from "../../../services/PassiveIncomeScheduler";
import { EXCLUDE_NON_EARNED, LOAN_CATEGORY, OPENING_CATEGORY } from "../../../utils/journal";

// Pemasukan hasil kerja/usaha: tanpa baris internal, saldo awal, dan uang pinjaman,
// supaya tren, rasio, dan kalender tidak melonjak.
const REAL_INCOME = `date >= $0 AND date <= $1 AND isInternal == false AND ${EXCLUDE_NON_EARNED}`;

/** All computed data + local UI state backing the Dashboard screen. */
export function useDashboardData() {
  const { settings } = useSettingsStore();
  const realm = useRealm();

  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debtInfos = useDebts();
  const activeDebts = useMemo(() => debtInfos.filter((d) => !d.lunas), [debtInfos]);
  const investments = useQuery(InvestmentModel).filtered("sold == false");
  const physicalAssets = useQuery(PhysicalAssetModel).filtered("sold == false");
  const recurringRules = useQuery(PassiveIncomeModel).filtered("recurring == true");

  useEffect(() => {
    realm.write(() => runPassiveIncomeSchedule(realm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm]);

  const reminders = useReminders();
  useEffect(() => {
    refreshAllReminders(realm);
  }, [realm, incomes, expenses, debtInfos, reminders, settings]);

  const now = dayjs();
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();

  const prevMonthStart = useMemo(
    () => dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    [],
  );
  const prevMonthEnd = useMemo(
    () => dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    [],
  );

  const summary = useMemo(() => {
    const monthlyIncome = incomes
      .filtered(REAL_INCOME, monthStart, monthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const sumCategory = (category: string) =>
      incomes
        .filtered("date >= $0 AND date <= $1 AND isInternal == false AND category == $2", monthStart, monthEnd, category)
        .reduce((s, i) => s + i.amount, 0);
    const openingBalance = sumCategory(OPENING_CATEGORY);
    const loanIn = sumCategory(LOAN_CATEGORY);

    // Uang keluar bulan ini per jenis. Pengeluaran = kebutuhan + kewajiban + keinginan;
    // tabungan bukan pengeluaran karena uangnya tetap milikmu.
    const byKind: Record<SpendKind, number> = { need: 0, obligation: 0, want: 0, saving: 0, invest: 0 };
    for (const e of expenses.filtered("date >= $0 AND date <= $1 AND isInternal == false", monthStart, monthEnd)) {
      byKind[isSpendKind(e.kind) ? e.kind : "need"] += e.amount;
    }
    const monthlyExpense = byKind.need + byKind.obligation + byKind.want;

    const prevIncome = incomes
      .filtered(REAL_INCOME, prevMonthStart, prevMonthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const prevExpense = expenses
      .filtered('date >= $0 AND date <= $1 AND isInternal == false AND kind != "saving" AND kind != "invest"', prevMonthStart, prevMonthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const { spendable: cash, savings: totalSavings } = getBalances(realm);

    // Nilai investasi yang dicatat di halaman Investasi + uang Investasi yang
    // dicatat lewat transaksi saja (sesuai modal).
    const totalInvestment =
      investments.reduce((s, inv) => s + inv.currentPrice * inv.quantity, 0) +
      getUntrackedInvestment(realm);

    const totalAssets = physicalAssets.reduce(
      (s, a) =>
        s +
        calcDepreciation(
          a.purchasePrice,
          a.residualValue,
          a.usefulLife,
          a.purchaseDate,
        ),
      0,
    );

    // Pemasukan rutin per bulan (yang tahunan dibagi 12).
    const recurringIncome = recurringRules.reduce(
      (s, p) => s + (p.frequency === "yearly" ? p.amount / 12 : p.amount),
      0,
    );

    const totalDebt = activeDebts.reduce((s, d) => s + d.remaining, 0);
    const monthlyInstallment = activeDebts.reduce(
      (s, d) => s + Math.min(d.debt.monthlyInstallment, d.remaining),
      0,
    );
    const debtRatio =
      monthlyIncome > 0 ? (monthlyInstallment / monthlyIncome) * 100 : 0;
    const netWorth =
      cash + totalSavings + totalInvestment + totalAssets - totalDebt;

    const savingsRate =
      monthlyIncome > 0
        ? Math.max(0, ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)
        : 0;

    const expenseRatio =
      monthlyIncome > 0
        ? Math.min(100, (monthlyExpense / monthlyIncome) * 100)
        : 0;

    const incomeTrend =
      prevIncome > 0 ? ((monthlyIncome - prevIncome) / prevIncome) * 100 : 0;

    const expenseTrend =
      prevExpense > 0
        ? ((monthlyExpense - prevExpense) / prevExpense) * 100
        : 0;

    return {
      byKind,
      cash,
      totalSavings,
      totalInvestment,
      totalAssets,
      totalDebt,
      netWorth,
      monthlyIncome,
      openingBalance,
      loanIn,
      monthlyExpense,
      cashflow: monthlyIncome - monthlyExpense,
      debtRatio,
      monthlyInstallment,
      recurringIncome,
      savingsRate,
      expenseRatio,
      incomeTrend,
      expenseTrend,
    };
  }, [
    incomes,
    expenses,
    activeDebts,
    investments,
    physicalAssets,
    recurringRules,
    monthStart,
    monthEnd,
    prevMonthStart,
    prevMonthEnd,
  ]);

  // Pengingat pembayaran: kewajiban + tagihan buatan user, tier lunas / hari-ini / mendesak / segera / aman.
  const dueItems = useMemo(() => {
    const items: DueItem[] = [];
    for (const d of activeDebts) {
      const status = getReminderStatus(d);
      if (status) items.push({ key: `debt-${d.id}`, source: "debt", name: d.debt.name, amount: d.debt.monthlyInstallment, status });
    }
    for (const r of reminders) {
      if (!r.status) continue;
      // Tagihan yang masih jauh tidak ikut; yang sudah dibayar cuma kalau jatuh temponya bulan ini.
      const show = r.paidCurrent ? r.currentInThisMonth : r.status.daysUntil <= 7;
      if (show) items.push({ key: `bill-${r.id}`, source: "bill", name: r.reminder.title, amount: r.reminder.amount, status: r.status });
    }
    return items.sort((a, b) => a.status.daysUntil - b.status.daysUntil);
  }, [activeDebts, reminders]);

  const urgentReminders = useMemo(() => dueItems.filter((r) => r.status.urgent), [dueItems]);
  const normalReminders = useMemo(
    () => dueItems.filter((r) => !r.status.urgent && r.status.tier !== "lunas"),
    [dueItems],
  );
  const paidReminders = useMemo(() => dueItems.filter((r) => r.status.tier === "lunas"), [dueItems]);

  const monthLabel = now.format("MMMM YYYY");

  // ─── Modal / picker UI state ────────────────────────────────────────────────
  const [showReminders, setShowReminders] = useState(false);

  return {
    now,
    monthLabel,
    settings,

    summary,

    urgentReminders,
    normalReminders,
    paidReminders,

    showReminders,
    setShowReminders,
  };
}

export type DashboardData = ReturnType<typeof useDashboardData>;
