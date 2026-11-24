import Realm from 'realm';
import { IncomeModel } from '../../models/IncomeModel';
import { ExpenseModel } from '../../models/ExpenseModel';
import { DebtModel } from '../../models/DebtModel';
import { GoalModel } from '../../models/GoalModel';
import { buildDebtInfos } from '../../utils/debt';

export interface BirthdayRecap {
  records: number;
  activeDays: number;
  saved: number;
  invested: number;
  debtPaid: number;
  debtsCleared: number;
  goalsReached: number;
}

/**
 * Capaian sejak ulang tahun lalu. Yang dihitung usaha (mencatat, menyisihkan,
 * melunasi), bukan besar pemasukan, supaya rekapnya terasa adil untuk siapa saja.
 */
export function buildBirthdayRecap(realm: Realm, since: string, until: string): BirthdayRecap {
  const range = 'date >= $0 AND date <= $1 AND isInternal == false';
  const incomes = realm.objects(IncomeModel).filtered(range, since, until);
  const expenses = realm.objects(ExpenseModel).filtered(`${range} AND source != "adjust"`, since, until);

  const days = new Set<string>();
  for (const i of incomes) days.add(i.date);
  for (const e of expenses) days.add(e.date);

  const sum = (kind: string) =>
    expenses.filtered('kind == $0 AND source != "savings"', kind).sum('amount') ?? 0;
  const payments = expenses.filtered('debtId != ""');

  // Lunas dan ada pembayaran di rentang ini = dilunasi tahun ini.
  const paidIds = new Set(payments.map((p) => p.debtId));
  const debtsCleared = buildDebtInfos(
    realm.objects(DebtModel),
    realm.objects(ExpenseModel).filtered('debtId != ""'),
  ).filter((d) => d.lunas && paidIds.has(d.id)).length;

  return {
    records: incomes.length + expenses.length,
    activeDays: days.size,
    saved: sum('saving'),
    invested: sum('invest'),
    debtPaid: payments.sum('amount') ?? 0,
    debtsCleared,
    goalsReached: realm.objects(GoalModel).filtered('doneAt >= $0 AND doneAt <= $1', since, until).length,
  };
}

/** Kalimat penutup mengikuti capaian paling bermakna. */
export function closingLine(r: BirthdayRecap): string {
  if (r.goalsReached > 0) return 'Kamu sudah membuktikan target bisa dicapai. Tahun ini, kejar mimpi yang lebih besar lagi.';
  if (r.debtsCleared > 0) return 'Melunasi kewajiban butuh sabar dan disiplin. Kamu berhasil, dan itu patut dibanggakan.';
  if (r.saved > 0) return 'Setiap rupiah yang kamu sisihkan adalah hadiah untuk dirimu di masa depan.';
  if (r.records > 0) return 'Mencatat dengan konsisten itu langkah kecil yang dampaknya besar. Terus lanjutkan, ya.';
  return 'Setiap perjalanan besar dimulai dari satu langkah. Tahun ini milikmu, dan Dompetku siap menemani.';
}
