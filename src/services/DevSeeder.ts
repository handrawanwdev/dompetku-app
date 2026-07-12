import Realm from 'realm';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { DebtModel } from '../models/DebtModel';
import { DebtPaymentModel } from '../models/DebtPaymentModel';
import { SavingModel } from '../models/SavingModel';
import { SavingHistoryModel } from '../models/SavingHistoryModel';
import { InvestmentModel } from '../models/InvestmentModel';
import { PhysicalAssetModel } from '../models/PhysicalAssetModel';
import { GoalModel } from '../models/GoalModel';
import { CategoryModel } from '../models/CategoryModel';
import { PassiveIncomeModel } from '../models/PassiveIncomeModel';
import { FinancialMilestoneModel } from '../models/FinancialMilestoneModel';

const EXPENSE_CATEGORIES = [
  { name: 'Makanan', emoji: '🍔' },
  { name: 'Transportasi', emoji: '🚗' },
  { name: 'Tagihan', emoji: '🧾' },
  { name: 'Hiburan', emoji: '🎬' },
  { name: 'Belanja', emoji: '🛒' },
  { name: 'Kesehatan', emoji: '💊' },
];

const INCOME_CATEGORIES = [
  { name: 'Gaji', emoji: '💼' },
  { name: 'Bonus', emoji: '🎁' },
  { name: 'Freelance', emoji: '💻' },
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function dateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export interface SeedSummary {
  categories: number;
  incomes: number;
  expenses: number;
  debts: number;
  debtPayments: number;
  savings: number;
  savingHistory: number;
  investments: number;
  physicalAssets: number;
  goals: number;
  passiveIncomes: number;
  milestones: number;
}

export function seedDummyData(realm: Realm): SeedSummary {
  const summary: SeedSummary = {
    categories: 0,
    incomes: 0,
    expenses: 0,
    debts: 0,
    debtPayments: 0,
    savings: 0,
    savingHistory: 0,
    investments: 0,
    physicalAssets: 0,
    goals: 0,
    passiveIncomes: 0,
    milestones: 0,
  };

  realm.write(() => {
    EXPENSE_CATEGORIES.forEach(c => {
      realm.create(CategoryModel, { name: c.name, type: 'expense', emoji: c.emoji });
      summary.categories += 1;
    });
    INCOME_CATEGORIES.forEach(c => {
      realm.create(CategoryModel, { name: c.name, type: 'income', emoji: c.emoji });
      summary.categories += 1;
    });

    const savings: SavingModel[] = [];
    [
      { name: 'Dana Darurat', target: 20_000_000, balance: 6_500_000, emoji: '🚨' },
      { name: 'Liburan', target: 10_000_000, balance: 2_000_000, emoji: '✈️' },
    ].forEach(s => {
      const saving = realm.create(SavingModel, { ...s });
      savings.push(saving);
      summary.savings += 1;
    });

    savings.forEach(saving => {
      for (let i = 0; i < 3; i++) {
        const amount = randInt(200_000, 1_000_000);
        realm.create(SavingHistoryModel, {
          savingId: saving._id.toHexString(),
          type: 'deposit',
          amount,
          date: dateDaysAgo(randInt(1, 60)),
          note: 'Setoran rutin',
        });
        summary.savingHistory += 1;
      }
    });

    const debt = realm.create(DebtModel, {
      name: 'KPR Rumah',
      lender: 'Bank BCA',
      totalAmount: 300_000_000,
      monthlyInstallment: 3_500_000,
      remainingMonth: 96,
      dueDate: 10,
      startDate: dateDaysAgo(180),
      note: 'Cicilan bulanan',
      isActive: true,
      extraPaid: 0,
    });
    summary.debts += 1;

    for (let i = 0; i < 3; i++) {
      realm.create(DebtPaymentModel, {
        debtId: debt._id.toHexString(),
        amount: 3_500_000,
        date: dateDaysAgo(30 * (i + 1)),
        note: 'Pembayaran cicilan',
      });
      summary.debtPayments += 1;
    }

    for (let i = 0; i < 6; i++) {
      const category = pick(INCOME_CATEGORIES);
      realm.create(IncomeModel, {
        date: dateDaysAgo(randInt(1, 90)),
        category: category.name,
        amount: randInt(5_000_000, 12_000_000),
        note: 'Data dummy',
        allocationDebt: 0,
        allocationSavings: 0,
        allocationCash: 0,
        allocationDebtId: '',
        allocationSavingId: '',
      });
      summary.incomes += 1;
    }

    for (let i = 0; i < 15; i++) {
      const category = pick(EXPENSE_CATEGORIES);
      realm.create(ExpenseModel, {
        date: dateDaysAgo(randInt(1, 90)),
        category: category.name,
        amount: randInt(20_000, 500_000),
        source: 'cash',
        savingId: '',
        note: 'Data dummy',
      });
      summary.expenses += 1;
    }

    [
      { type: 'stock', name: 'BBCA', buyPrice: 8_500, quantity: 100, currentPrice: 9_200 },
      { type: 'crypto', name: 'BTC', buyPrice: 400_000_000, quantity: 0.01, currentPrice: 450_000_000 },
      { type: 'gold', name: 'Emas Antam', buyPrice: 1_050_000, quantity: 5, currentPrice: 1_120_000 },
    ].forEach(inv => {
      realm.create(InvestmentModel, {
        ...inv,
        buyDate: dateDaysAgo(randInt(30, 200)),
        note: 'Data dummy',
        sold: false,
        sellPrice: 0,
        sellDate: '',
      });
      summary.investments += 1;
    });

    realm.create(PhysicalAssetModel, {
      name: 'Laptop Kerja',
      category: 'laptop',
      purchasePrice: 15_000_000,
      purchaseDate: dateDaysAgo(365),
      usefulLife: 4,
      residualValue: 2_000_000,
      note: 'Data dummy',
      sold: false,
      sellPrice: 0,
      sellDate: '',
    });
    summary.physicalAssets += 1;

    realm.create(GoalModel, {
      name: 'Beli Motor',
      target: 25_000_000,
      deadline: dateDaysAgo(-180),
      savingId: '',
      emoji: '🏍️',
      manualAmount: 5_000_000,
    });
    summary.goals += 1;

    realm.create(PassiveIncomeModel, {
      category: 'dividen',
      amount: 500_000,
      frequency: 'monthly',
      note: 'Data dummy',
    });
    summary.passiveIncomes += 1;

    realm.create(FinancialMilestoneModel, {
      type: 'first_saving',
      title: 'Tabungan Pertama',
      achievedAt: new Date(),
    });
    summary.milestones += 1;
  });

  return summary;
}

export function clearAllData(realm: Realm): void {
  realm.write(() => realm.deleteAll());
}
