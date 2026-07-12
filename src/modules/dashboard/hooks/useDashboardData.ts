import { useEffect, useMemo, useState } from "react";
import { useQuery, useRealm } from "@realm/react";
import dayjs from "dayjs";

import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { DebtModel } from "../../../models/DebtModel";
import { DebtPaymentModel } from "../../../models/DebtPaymentModel";
import { SavingModel } from "../../../models/SavingModel";
import { InvestmentModel } from "../../../models/InvestmentModel";
import { PhysicalAssetModel } from "../../../models/PhysicalAssetModel";
import { GoalModel } from "../../../models/GoalModel";
import { PassiveIncomeModel } from "../../../models/PassiveIncomeModel";
import { FinancialScoreModel } from "../../../models/FinancialScoreModel";
import { startOfMonth, endOfMonth } from "../../../utils/date";
import {
  calcDepreciation,
  getReminderStatus,
  getDebtRoadmap,
  getTrailing30d,
  getFinancialProjection,
  generateFinancialSuggestions,
  generateScoreRecommendations,
  buildNetWorthSeries,
  calcNetWorthGrowthPct,
  getEmergencyFundStatus,
  toMonthlyAmount,
} from "../../../utils/finance";
import { useSettingsStore } from "../../../store/settingsStore";
import { useCashflowChart } from "../../../hooks/useCashflowChart";
import {
  refreshDebtReminders,
  refreshDailyReminders,
} from "../../../services/NotificationService";
import { saveFinancialScoreSnapshot } from "../../../services/FinancialScoreService";
import { checkAndUnlockAchievements } from "../../../services/AchievementService";
import {
  computeFinancialScore,
  getLevel,
  getNextLevel,
  scoreNeededForNext,
} from "../../../utils/financialScore";
import { buildFinancialAdvisorReport } from "../../../ai/FinancialAdvisorService";

/** All computed data + local UI state backing the Dashboard screen. */
export function useDashboardData() {
  const { settings, updateSettings } = useSettingsStore();
  const realm = useRealm();

  const incomes = useQuery(IncomeModel);
  const expenses = useQuery(ExpenseModel);
  const debts = useQuery(DebtModel).filtered("isActive == true");
  const allDebts = useQuery(DebtModel);
  const debtPayments = useQuery(DebtPaymentModel);
  const savings = useQuery(SavingModel);
  const investments = useQuery(InvestmentModel).filtered("sold == false");
  const allInvestments = useQuery(InvestmentModel);
  const physicalAssets = useQuery(PhysicalAssetModel).filtered("sold == false");
  const goals = useQuery(GoalModel);
  const passiveIncomes = useQuery(PassiveIncomeModel);

  useEffect(() => {
    refreshDebtReminders(
      debts.map((d) => ({
        id: d._id.toHexString(),
        name: d.name,
        monthlyInstallment: d.monthlyInstallment,
        remainingMonth: d.remainingMonth,
        dueDate: d.dueDate,
      })),
    );
  }, [debts]);

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const recordedToday =
      incomes.filtered("date == $0", today).length > 0 ||
      expenses.filtered("date == $0", today).length > 0;
    refreshDailyReminders(recordedToday);
  }, [incomes, expenses]);

  const cashflow7d = useCashflowChart("7d");
  const cashflow12m = useCashflowChart("12m");

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
      .filtered("date >= $0 AND date <= $1", monthStart, monthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const monthlyExpense = expenses
      .filtered("date >= $0 AND date <= $1", monthStart, monthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const prevIncome = incomes
      .filtered("date >= $0 AND date <= $1", prevMonthStart, prevMonthEnd)
      .reduce((s, i) => s + i.amount, 0);

    const prevExpense = expenses
      .filtered("date >= $0 AND date <= $1", prevMonthStart, prevMonthEnd)
      .reduce((s, e) => s + e.amount, 0);

    const totalCashIncome = incomes.reduce((s, i) => s + i.allocationCash, 0);
    const totalCashExpense = expenses
      .filtered('source == "cash"')
      .reduce((s, e) => s + e.amount, 0);
    const cash = totalCashIncome - totalCashExpense;

    const totalSavings = savings.reduce((s, sv) => s + sv.balance, 0);

    const totalInvestment = investments.reduce(
      (s, inv) => s + inv.currentPrice * inv.quantity,
      0,
    );

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

    const totalDebt = debts.reduce(
      (s, d) => s + d.monthlyInstallment * d.remainingMonth,
      0,
    );

    const monthlyInstallment = debts.reduce(
      (s, d) => s + d.monthlyInstallment,
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
      cash,
      totalSavings,
      totalInvestment,
      totalAssets,
      totalDebt,
      netWorth,
      monthlyIncome,
      monthlyExpense,
      cashflow: monthlyIncome - monthlyExpense,
      debtRatio,
      monthlyInstallment,
      savingsRate,
      expenseRatio,
      incomeTrend,
      expenseTrend,
    };
  }, [
    incomes,
    expenses,
    debts,
    savings,
    investments,
    physicalAssets,
    monthStart,
    monthEnd,
    prevMonthStart,
    prevMonthEnd,
  ]);

  const monthlyPassiveIncome = useMemo(
    () =>
      passiveIncomes.reduce(
        (s, p) => s + toMonthlyAmount(p.amount, p.frequency),
        0,
      ),
    [passiveIncomes],
  );

  const scoreInput = useMemo(
    () => ({
      monthlyIncome: summary.monthlyIncome,
      monthlyExpense: summary.monthlyExpense,
      emergencyFund: summary.totalSavings,
      monthlyDebtInstallment: summary.monthlyInstallment,
      totalInvestedValue: summary.totalInvestment,
      passiveIncome: monthlyPassiveIncome,
    }),
    [summary, monthlyPassiveIncome],
  );

  const financialScore = useMemo(
    () => computeFinancialScore(scoreInput),
    [scoreInput],
  );
  const financialLevel = useMemo(
    () => getLevel(financialScore.score),
    [financialScore.score],
  );
  const nextFinancialLevel = useMemo(
    () => getNextLevel(financialScore.score),
    [financialScore.score],
  );
  const scoreGap = useMemo(
    () => scoreNeededForNext(financialScore.score),
    [financialScore.score],
  );

  const levelChecklist = useMemo(
    () => [
      { label: "Cashflow positif", done: financialScore.cashflowScore >= 60 },
      {
        label: "Emergency Fund 3+ bulan",
        done: financialScore.emergencyScore >= 75,
      },
      {
        label: "Rasio hutang sehat (<35%)",
        done: financialScore.debtScore >= 70,
      },
      { label: "Investasi rutin", done: financialScore.investmentScore >= 70 },
      { label: "Ada passive income", done: financialScore.passiveScore >= 60 },
    ],
    [financialScore],
  );

  useEffect(() => {
    saveFinancialScoreSnapshot(realm, scoreInput, summary.netWorth);
  }, [realm, scoreInput, summary.netWorth]);

  useEffect(() => {
    checkAndUnlockAchievements(realm, {
      hasSavingWithBalance: savings.some((s) => s.balance > 0),
      hasPaidOffDebt: allDebts.some((d) => !d.isActive),
      hasInvestment: allInvestments.length > 0,
      score: financialScore.score,
    });
  }, [realm, savings, allDebts, allInvestments, financialScore.score]);

  const scoreHistory = useQuery(FinancialScoreModel);
  const netWorthSeries = useMemo(
    () =>
      buildNetWorthSeries(
        scoreHistory.map((s) => ({
          netWorth: s.netWorth,
          createdAt: s.createdAt,
        })),
      ),
    [scoreHistory],
  );
  const netWorthGrowthPct = useMemo(
    () => calcNetWorthGrowthPct(netWorthSeries),
    [netWorthSeries],
  );

  const emergencyFundSaving = useMemo(
    () =>
      savings.find(
        (s) => s._id.toHexString() === settings.emergencyFundSavingId,
      ),
    [savings, settings.emergencyFundSavingId],
  );
  const emergencyFundInfo = useMemo(
    () =>
      emergencyFundSaving
        ? getEmergencyFundStatus(
            emergencyFundSaving.balance,
            emergencyFundSaving.target,
            summary.monthlyExpense,
          )
        : null,
    [emergencyFundSaving, summary.monthlyExpense],
  );

  const aiReport = useMemo(
    () =>
      buildFinancialAdvisorReport(
        scoreInput,
        emergencyFundInfo
          ? {
              current: emergencyFundInfo.current,
              target: emergencyFundInfo.target,
            }
          : {
              current: summary.totalSavings,
              target: summary.monthlyExpense * 3,
            },
        Math.max(summary.cashflow, 0),
      ),
    [
      scoreInput,
      emergencyFundInfo,
      summary.totalSavings,
      summary.monthlyExpense,
      summary.cashflow,
    ],
  );

  const topExpenseCategories = useMemo(() => {
    const monthExpenses = expenses.filtered(
      "date >= $0 AND date <= $1",
      monthStart,
      monthEnd,
    );
    const catMap: Record<string, number> = {};
    for (const e of monthExpenses) {
      catMap[e.category] = (catMap[e.category] ?? 0) + e.amount;
    }
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [expenses, monthStart, monthEnd]);

  // Neraca (itemized balance sheet)
  const neraca = useMemo(() => {
    const totalIncomeAllTime = incomes.reduce((s, i) => s + i.amount, 0);
    const investmentCost = investments.reduce(
      (s, inv) => s + inv.buyPrice * inv.quantity,
      0,
    );
    const totalAset =
      Math.max(0, summary.cash) +
      summary.totalSavings +
      investmentCost +
      summary.totalAssets;
    const kekayaanBersih = totalAset - summary.totalDebt;
    return { totalIncomeAllTime, investmentCost, totalAset, kekayaanBersih };
  }, [incomes, investments, summary]);

  // Debt reminder tiers (lunas / hari-ini / mendesak / segera / aman)
  const debtReminders = useMemo(() => {
    return debts
      .map((d) => {
        const paidThisMonth =
          debtPayments.filtered(
            "debtId == $0 AND date >= $1",
            d._id.toHexString(),
            monthStart,
          ).length > 0;
        const status = getReminderStatus({
          id: d._id.toHexString(),
          name: d.name,
          monthlyInstallment: d.monthlyInstallment,
          remainingMonth: d.remainingMonth,
          dueDate: d.dueDate,
          paidThisMonth,
        });
        return { debt: d, status };
      })
      .filter((x) => x.status !== null) as Array<{
      debt: DebtModel;
      status: NonNullable<ReturnType<typeof getReminderStatus>>;
    }>;
  }, [debts, debtPayments, monthStart]);

  const urgentReminders = useMemo(
    () => debtReminders.filter((r) => r.status.urgent),
    [debtReminders],
  );
  const normalReminders = useMemo(
    () =>
      debtReminders.filter(
        (r) => !r.status.urgent && r.status.tier !== "lunas",
      ),
    [debtReminders],
  );
  const paidReminders = useMemo(
    () => debtReminders.filter((r) => r.status.tier === "lunas"),
    [debtReminders],
  );

  // Roadmap bebas hutang (snowball order)
  const roadmap = useMemo(
    () =>
      getDebtRoadmap(
        debts.map((d) => ({
          id: d._id.toHexString(),
          name: d.name,
          remainingMonth: d.remainingMonth,
          monthlyInstallment: d.monthlyInstallment,
        })),
      ),
    [debts],
  );

  // Proyeksi finansial
  const trailing30d = useMemo(
    () =>
      getTrailing30d(
        incomes as unknown as { date: string; amount: number }[],
        expenses as unknown as { date: string; amount: number }[],
      ),
    [incomes, expenses],
  );
  const maxRemainingMonth = useMemo(
    () => (debts.length ? Math.max(...debts.map((d) => d.remainingMonth)) : 0),
    [debts],
  );
  const projection = useMemo(
    () =>
      getFinancialProjection({
        cashNow: summary.cash,
        totalSavings: summary.totalSavings,
        maxRemainingMonth,
        monthlyInstallmentTotal: summary.monthlyInstallment,
        trailingExpense30d: trailing30d.expense,
      }),
    [summary, maxRemainingMonth, trailing30d],
  );

  // Rekomendasi (multi-card): event-driven cards + sub-score driven tips (PRD §15)
  const suggestions = useMemo(
    () => [
      ...generateFinancialSuggestions({
        cashNow: summary.cash,
        debtRatioPct: summary.debtRatio,
        debtRatioLimit: settings.debtRatioLimit,
        urgentDebtNames: urgentReminders.map((r) => r.debt.name),
        almostPaidOffDebts: debts
          .filter((d) => d.remainingMonth > 0 && d.remainingMonth <= 2)
          .map((d) => ({ name: d.name, remainingMonth: d.remainingMonth })),
      }),
      ...generateScoreRecommendations(financialScore),
    ],
    [summary, settings, urgentReminders, debts, financialScore],
  );

  const monthLabel = now.format("MMMM YYYY");

  // ─── Modal / picker UI state ────────────────────────────────────────────────
  const [showLevelDetail, setShowLevelDetail] = useState(false);
  const [showEmergencyPicker, setShowEmergencyPicker] = useState(false);
  const [showAiDetail, setShowAiDetail] = useState(false);

  return {
    now,
    monthLabel,
    settings,
    updateSettings,

    summary,
    financialScore,
    financialLevel,
    nextFinancialLevel,
    scoreGap,
    levelChecklist,

    netWorthSeries,
    netWorthGrowthPct,

    savings,
    goals,

    emergencyFundSaving,
    emergencyFundInfo,

    aiReport,

    topExpenseCategories,
    neraca,

    urgentReminders,
    normalReminders,
    paidReminders,

    roadmap,
    projection,
    suggestions,

    cashflow7d,
    cashflow12m,

    showLevelDetail,
    setShowLevelDetail,
    showEmergencyPicker,
    setShowEmergencyPicker,
    showAiDetail,
    setShowAiDetail,
  };
}

export type DashboardData = ReturnType<typeof useDashboardData>;
