import Realm from 'realm';
import { DEFAULT_EXPENSE_CATEGORIES } from '../constants';
import { kindFromLegacyCategory, RENAMED_CATEGORIES } from '../utils/budget';

/**
 * Tambahkan kategori pengeluaran bawaan yang belum ada (dicocokkan per nama).
 * Pakai nama skema string supaya bisa dipanggil juga dari migrasi.
 * Must run inside a write transaction.
 */
export function ensureDefaultExpenseCategories(realm: Realm): void {
  const existing = realm.objects('Category').filtered('type == "expense"') as unknown as Array<{ name: string }>;
  const names = new Set(existing.map((c) => c.name));
  for (const d of DEFAULT_EXPENSE_CATEGORIES) {
    if (names.has(d.name)) continue;
    realm.create('Category', {
      _id: new Realm.BSON.ObjectId(),
      name: d.name,
      type: 'expense',
      emoji: d.emoji,
      kind: d.kind,
      createdAt: new Date(),
    });
  }
}

type Named = { name: string; kind: string };

/**
 * Rapikan data lama: ganti nama kategori lama, isi jenis tiap kategori
 * pengeluaran, lengkapi kategori bawaan, lalu samakan jenis transaksi dengan
 * kategorinya. Dipakai migrasi v16 dan import backup. Must run inside a write.
 */
export function normalizeExpenseCategories(realm: Realm): void {
  const defaultKind = new Map(DEFAULT_EXPENSE_CATEGORIES.map((d) => [d.name, d.kind] as const));

  const cats = realm.objects('Category').filtered('type == "expense"') as unknown as Named[];
  for (const c of cats) {
    c.name = RENAMED_CATEGORIES[c.name] ?? c.name;
    if (!c.kind) c.kind = defaultKind.get(c.name) ?? kindFromLegacyCategory(c.name);
  }
  ensureDefaultExpenseCategories(realm);

  const kindByName = new Map(
    (realm.objects('Category').filtered('type == "expense"') as unknown as Named[]).map((c) => [c.name, c.kind] as const),
  );
  const exps = realm.objects('Expense').filtered('isInternal == false') as unknown as Array<{ category: string; kind: string }>;
  for (const e of exps) {
    e.category = RENAMED_CATEGORIES[e.category] ?? e.category;
    const k = kindByName.get(e.category);
    if (k) e.kind = k;
  }
}
