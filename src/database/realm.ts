import Realm from 'realm';
import dayjs from 'dayjs';
import { ALL_MODELS } from '../models';
import { kindFromLegacyCategory } from '../utils/budget';
import { convertLegacyDebt, type LegacyDebt } from '../utils/debt';
import { ensureDefaultExpenseCategories, normalizeExpenseCategories } from '../services/CategoryService';

export const realmConfig: Realm.Configuration = {
  schema: ALL_MODELS,
  // v14: FinancialScore & FinancialMilestone (gamification) dropped.
  // v15: Kas + pos Tabungan dilebur jadi satu saldo; tiap uang keluar punya
  // jenis Kebutuhan/Keinginan/Tabungan. Goal, Saving & SavingHistory dihapus —
  // Realm membuang tabelnya saat dibuka.
  // v16: jenis pindah ke level kategori (Category.kind) + jenis Kewajiban.
  // v17: Kewajiban disederhanakan; pembayarannya = transaksi biasa (Expense.debtId).
  // DebtPayment dihapus.
  // v18: jenis Investasi + Expense.assetRef (pembelian investasi/aset).
  // v21: Income.ref (hasil jual investasi/aset, uang pinjaman masuk). Default '' cukup.
  // v22: Goal (target tabungan) + Expense.goalId. Goal tanpa saldo sendiri;
  // progres dihitung dari transaksi yang ditandai. Default '' cukup.
  // v23: Account.subName (keterangan opsional kantong). Default '' cukup.
  schemaVersion: 23,
  onFirstOpen: (realm) => {
    ensureDefaultExpenseCategories(realm);
  },
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 12) {
      // isInternal isn't backfilled by Realm's default — flag pre-existing
      // synthetic rows so ratio calcs exclude them retroactively.
      const newIncomes = newRealm.objects('Income') as unknown as Array<{ category: string; isInternal: boolean }>;
      for (const i of newIncomes) {
        if (i.category === 'Tarik Tabungan') i.isInternal = true;
      }
    }

    if (oldRealm.schemaVersion < 8) {
      // Existing PassiveIncome rows predate the one-off/recurring distinction.
      const newPassiveIncomes = newRealm.objects('PassiveIncome') as unknown as Array<{ recurring: boolean }>;
      for (const p of newPassiveIncomes) {
        p.recurring = true;
      }
    }

    if (oldRealm.schemaVersion < 15) {
      type Exp = { category: string; kind: string; source: string; amount: number; isInternal: boolean };
      const newExpenses = newRealm.objects('Expense') as unknown as Exp[];
      let derived = 0;
      for (const e of newExpenses) {
        e.kind = kindFromLegacyCategory(e.category);
        if (e.kind === 'saving') {
          // Setor Tabungan dulu internal; sekarang dihitung sebagai jenis Tabungan.
          e.isInternal = false;
          e.category = 'Tabungan';
        }
        if (e.source === 'savings') derived -= e.amount;
        else if (e.kind === 'saving') derived += e.amount;
      }

      // Total saldo pos tabungan lama adalah kebenaran. Selisihnya dengan hasil
      // hitung dari baris Expense disimpan sebagai satu baris koreksi internal.
      let oldTotal = 0;
      try {
        const oldSavings = oldRealm.objects('Saving') as unknown as Array<{ balance: number }>;
        oldTotal = oldSavings.reduce((s, x) => s + (x.balance ?? 0), 0);
      } catch {
        // Skema lama tanpa tabel Saving.
      }
      const diff = oldTotal - derived;
      if (Math.abs(diff) >= 1) {
        newRealm.create('Expense', {
          _id: new Realm.BSON.ObjectId(),
          date: dayjs().format('YYYY-MM-DD'),
          category: 'Saldo awal tabungan',
          kind: 'saving',
          amount: diff,
          source: 'adjust',
          savingId: '',
          note: 'Gabungan saldo pos tabungan lama',
          isInternal: true,
          createdAt: new Date(),
        });
      }
    }

    if (oldRealm.schemaVersion < 16) {
      // Kategori lama belum punya jenis di skema sebelumnya, jadi kosongkan dulu
      // supaya diisi ulang dari daftar bawaan / peta lama.
      for (const c of newRealm.objects('Category') as unknown as Array<{ kind: string }>) c.kind = '';
      normalizeExpenseCategories(newRealm);
    }

    if (oldRealm.schemaVersion < 17) {
      migrateDebtsToV17(oldRealm, newRealm);
    }

    if (oldRealm.schemaVersion < 18) {
      // Tambah kategori bawaan jenis Investasi.
      ensureDefaultExpenseCategories(newRealm);
    }
    if (oldRealm.schemaVersion < 23) {
      // Ikon celengan diganti gembok untuk kategori jenis Tabungan.
      for (const c of newRealm.objects('Category').filtered('emoji == "🐷"') as unknown as Array<{ emoji: string }>) {
        c.emoji = '🔒';
      }
    }
    // v19: kantong (Account) + pindah saldo (Transfer). Transaksi lama accountId '' (belum masuk kantong).
    // v20: Account.isSavings + Expense.toAccountId (sisihkan ke kantong tabungan). Default cukup.
  },
};

type OldDebt = LegacyDebt & { _id: Realm.BSON.ObjectId };
type OldPayment = { debtId: string; amount: number; date: string };
type NewExpense = { debtId: string; amount: number; date: string; category: string; kind: string };

/**
 * Kewajiban v17: pembayaran lama dihubungkan ke transaksi "Cicilan" yang cocok
 * (tanggal + nominal), lalu tiap utang diubah ke bentuk baru dengan sisa tetap.
 * Tagihan rutin (listrik, internet) bukan utang lagi — dihapus, transaksinya
 * pindah ke kategori Tagihan.
 */
function migrateDebtsToV17(oldRealm: Realm, newRealm: Realm) {
  const oldDebts = oldRealm.objects('Debt') as unknown as OldDebt[];
  let oldPayments: OldPayment[] = [];
  try {
    oldPayments = [...(oldRealm.objects('DebtPayment') as unknown as OldPayment[])];
  } catch {
    // skema lama tanpa DebtPayment
  }
  const freeExpenses = [...(newRealm.objects('Expense').filtered(
    'debtId == "" AND category IN {"Cicilan", "Bayar Cicilan"}',
  ) as unknown as NewExpense[])];

  for (const od of oldDebts) {
    const id = od._id.toHexString();
    const nd = newRealm.objectForPrimaryKey('Debt', od._id as never) as unknown as (Realm.Object & Record<string, unknown>) | null;
    if (!nd) continue;
    const payments = oldPayments.filter((p) => p.debtId === id);
    const isBill = od.debtType === 'tagihan_rutin';

    let linked = 0;
    for (const p of payments) {
      const i = freeExpenses.findIndex((e) => e.date === p.date && e.amount === p.amount);
      if (i < 0) continue;
      const e = freeExpenses.splice(i, 1)[0];
      if (isBill) {
        e.category = 'Tagihan';
        e.kind = 'need';
      } else {
        e.debtId = id;
        linked += e.amount;
      }
    }

    const converted = convertLegacyDebt(od, payments.reduce((s, p) => s + p.amount, 0), linked);
    if (!converted) newRealm.delete(nd);
    else Object.assign(nd, converted);
  }
}
