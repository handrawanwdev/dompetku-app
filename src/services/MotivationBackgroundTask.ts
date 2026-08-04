import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import Realm from 'realm';

import { realmConfig } from '../database/realm';
import { IncomeModel } from '../models/IncomeModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { DebtModel } from '../models/DebtModel';
import { SavingModel } from '../models/SavingModel';
import { InvestmentModel } from '../models/InvestmentModel';
import { PassiveIncomeModel } from '../models/PassiveIncomeModel';
import { computeFinancialScore } from '../utils/financialScore';
import { getScheduledMotivation, getSixHourBucket } from '../utils/motivation';
import { QUOTE_CATEGORY_LABEL } from '../data/motivationQuotes';
import { toMonthlyAmount } from '../utils/finance';
import { startOfMonth, endOfMonth } from '../utils/date';
import { storage, getSettings } from '../storage/mmkv';

const TASK_NAME = 'motivation-quote-check';
const LAST_BUCKET_KEY = 'motivation-last-bucket';

TaskManager.defineTask(TASK_NAME, async () => {
  let realm: Realm | null = null;
  try {
    const currentBucket = getSixHourBucket();
    const lastBucket = storage.getNumber(LAST_BUCKET_KEY);
    if (lastBucket === currentBucket) {
      // Already notified for this 6-hour window — the OS just ran the task early/again.
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    realm = await Realm.open(realmConfig);
    const monthStart = startOfMonth();
    const monthEnd = endOfMonth();

    const monthlyIncome = realm
      .objects(IncomeModel)
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .sum('amount') ?? 0;
    const monthlyExpense = realm
      .objects(ExpenseModel)
      .filtered('date >= $0 AND date <= $1', monthStart, monthEnd)
      .sum('amount') ?? 0;

    const activeDebts = realm.objects(DebtModel).filtered('isActive == true');
    const monthlyDebtInstallment = activeDebts.sum('monthlyInstallment') ?? 0;

    const settings = getSettings() as { emergencyFundSavingId?: string } | null;
    const savings = realm.objects(SavingModel);
    const emergencyFundSaving = settings?.emergencyFundSavingId
      ? savings.find((s) => s._id.toHexString() === settings.emergencyFundSavingId)
      : undefined;
    const emergencyFund = emergencyFundSaving
      ? emergencyFundSaving.balance
      : (savings.sum('balance') ?? 0);

    const totalInvestedValue = realm
      .objects(InvestmentModel)
      .filtered('sold == false')
      .reduce((s, inv) => s + inv.currentPrice * inv.quantity, 0);

    const passiveIncome = realm
      .objects(PassiveIncomeModel)
      .reduce((s, p) => s + toMonthlyAmount(p.amount, p.frequency), 0);

    const score = computeFinancialScore({
      monthlyIncome,
      monthlyExpense,
      emergencyFund,
      monthlyDebtInstallment,
      totalInvestedValue,
      passiveIncome,
    });

    const { category, quote } = getScheduledMotivation(score);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: QUOTE_CATEGORY_LABEL[category],
        body: quote,
        sound: true,
      },
      trigger: null,
    });
    storage.set(LAST_BUCKET_KEY, currentBucket);

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('motivation-quote-check failed', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  } finally {
    realm?.close();
  }
});

/** Registers the ~6-hourly motivational quote check. Call once at app startup. */
export async function registerMotivationBackgroundTask() {
  const alreadyRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (alreadyRegistered) return;
  await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 360 });
}
