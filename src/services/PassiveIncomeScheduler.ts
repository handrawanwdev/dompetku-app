import Realm from 'realm';
import dayjs from 'dayjs';

import { PassiveIncomeModel } from '../models/PassiveIncomeModel';
import { IncomeModel } from '../models/IncomeModel';
import { PASSIVE_INCOME_CATEGORIES } from '../utils/finance';

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  PASSIVE_INCOME_CATEGORIES.map(c => [c.value, c.label]),
);

/**
 * Auto-generates an Income transaction (into Kas Bebas) for every recurring
 * PassiveIncome entry whose current period hasn't been generated yet: monthly
 * entries post on the 1st of the month, yearly entries post on 1 January.
 * Must run inside realm.write().
 */
export function runPassiveIncomeSchedule(realm: Realm): void {
  const now = dayjs();
  const entries = realm.objects(PassiveIncomeModel).filtered('recurring == true');

  for (const p of entries) {
    const isYearly = p.frequency === 'yearly';
    const anchor = isYearly ? now.startOf('year') : now.startOf('month');
    const periodKey = isYearly ? anchor.format('YYYY') : anchor.format('YYYY-MM');
    if (p.lastGeneratedPeriod === periodKey) continue;

    realm.create(IncomeModel, {
      _id: new Realm.BSON.ObjectId(),
      category: CATEGORY_LABEL[p.category] ?? p.category,
      amount: p.amount,
      allocationCash: p.amount,
      allocationDebt: 0,
      allocationSavings: 0,
      allocationDebtId: '',
      allocationSavingId: '',
      date: anchor.format('YYYY-MM-DD'),
      note: `Passive income terjadwal: ${p.note || p.category}`,
      createdAt: new Date(),
    });
    p.lastGeneratedPeriod = periodKey;
  }
}
