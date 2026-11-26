import { formatCompact } from './currency';

// Level keuangan 0–7: dari bergantung sampai berlimpah. Hitungan murni dari
// angka rata-rata; pengumpulan datanya di modules/freedom/useFreedomLevel.

export interface FreedomInput {
  /** Jumlah bulan yang dipakai untuk rata-rata (1–3). */
  months: number;
  /** Rata-rata uang masuk hasil kerja/usaha per bulan. */
  avgIncome: number;
  /** Rata-rata kebutuhan pokok per bulan (Kebutuhan + Kewajiban). */
  avgNeeds: number;
  /** Rata-rata uang keluar per bulan (Kebutuhan + Kewajiban + Keinginan). */
  avgExpense: number;
  /** Cicilan tetap per bulan dari utang aktif. */
  monthlyInstallment: number;
  /** Batas sehat cicilan, % dari uang masuk. */
  installmentLimit: number;
  /** Sisa semua utang aktif. */
  totalDebt: number;
  /** Saldo Tabungan sekarang. */
  savings: number;
  /** Nilai investasi sekarang (aset yang menghasilkan). */
  productiveAssets: number;
}

export interface Criterion {
  /** Syarat dalam satu kalimat pendek. */
  label: string;
  done: boolean;
  /** 0–1. */
  progress: number;
  /** Posisi sekarang, mis. "Rp 335rb dari Rp 4,5jt". */
  now: string;
  /** Langkah berikutnya kalau belum terpenuhi. */
  todo: string;
}

export interface LevelDef {
  level: number;
  name: string;
  /** Satu kalimat pendek: kondisi di level ini. */
  short: string;
}

export const LEVELS: LevelDef[] = [
  { level: 0, name: 'Bergantung', short: 'Belum punya penghasilan sendiri' },
  { level: 1, name: 'Bertahan', short: 'Penghasilan cukup untuk kebutuhan pokok' },
  { level: 2, name: 'Stabil', short: 'Tidak minus, cicilan wajar, dana darurat 3 bulan' },
  { level: 3, name: 'Bebas utang', short: 'Tanpa utang, dana darurat 6 bulan' },
  { level: 4, name: 'Aman', short: 'Investasi menutup ½ biaya hidup' },
  { level: 5, name: 'Mandiri', short: 'Investasi menutup seluruh biaya hidup' },
  { level: 6, name: 'Bebas finansial', short: 'Investasi 2× biaya hidup' },
  { level: 7, name: 'Berlimpah', short: 'Investasi 3× biaya hidup' },
];

/** Aturan 4%: aset yang dibutuhkan = pengeluaran setahun × 25. */
export const FIRE_MULTIPLIER = 25;
const ASSET_RATIO: Record<number, number> = { 4: 0.5, 5: 1, 6: 2, 7: 3 };

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0);
const rp = (v: number) => `Rp ${formatCompact(Math.round(Math.max(v, 0)))}`;

function reach(label: string, value: number, target: number, todo: (gap: string) => string): Criterion {
  const done = target > 0 && value >= target;
  return {
    label,
    done,
    progress: target > 0 ? clamp01(value / target) : 0,
    now: `${rp(value)} dari ${rp(target)}`,
    todo: done ? '' : todo(rp(target - value)),
  };
}

const NO_EXPENSE: Criterion = {
  label: 'Uang keluar sudah dicatat',
  done: false,
  progress: 0,
  now: 'Belum ada catatan uang keluar',
  todo: 'Catat uang keluar dulu supaya biaya hidupmu terhitung',
};

/** Syarat untuk mencapai `level` (di luar syarat level sebelumnya). */
export function criteriaFor(level: number, i: FreedomInput): Criterion[] {
  const noExpense = i.avgExpense <= 0;

  switch (level) {
    case 1: {
      const enough = i.avgIncome > 0 && i.avgIncome >= i.avgNeeds;
      return [
        {
          label: 'Penghasilan cukup untuk kebutuhan pokok',
          done: enough,
          progress: i.avgNeeds > 0 ? clamp01(i.avgIncome / i.avgNeeds) : i.avgIncome > 0 ? 1 : 0,
          now: i.avgIncome > 0 ? `Masuk ${rp(i.avgIncome)}, pokok ${rp(i.avgNeeds)} /bln` : 'Belum ada uang masuk dari kerja/usaha',
          todo: enough ? '' : i.avgIncome > 0 ? 'Penghasilan belum cukup untuk kebutuhan pokok' : 'Catat uang masuk dari kerja atau usaha',
        },
      ];
    }
    case 2: {
      const surplus = i.avgIncome - i.avgExpense;
      const ratio = i.avgIncome > 0 ? (i.monthlyInstallment / i.avgIncome) * 100 : 0;
      const ratioOk = i.monthlyInstallment <= 0 || (i.avgIncome > 0 && ratio <= i.installmentLimit);
      return [
        {
          label: 'Uang keluar tidak lebih besar dari uang masuk',
          done: surplus >= 0,
          progress: i.avgExpense > 0 ? clamp01(i.avgIncome / i.avgExpense) : 1,
          now: surplus >= 0 ? `Sisa ${rp(surplus)}/bln` : `Minus ${rp(-surplus)}/bln`,
          todo: surplus >= 0 ? '' : `Hemat ${rp(-surplus)}/bln supaya tidak minus`,
        },
        {
          label: `Cicilan maks ${i.installmentLimit}% dari uang masuk`,
          done: ratioOk,
          progress: ratioOk ? 1 : clamp01(i.installmentLimit / Math.max(ratio, 1)),
          now: i.monthlyInstallment > 0 ? `Sekarang ${ratio.toFixed(0)}%` : 'Tidak ada cicilan',
          todo: ratioOk ? '' : `Turunkan cicilan ke maks ${i.installmentLimit}% (sekarang ${ratio.toFixed(0)}%)`,
        },
        noExpense
          ? NO_EXPENSE
          : reach('Dana darurat 3 bulan', i.savings, i.avgExpense * 3, (gap) => `Tambah tabungan ${gap} lagi`),
      ];
    }
    case 3: {
      const free = i.totalDebt <= 0;
      return [
        {
          label: 'Semua utang lunas',
          done: free,
          progress: free ? 1 : 0,
          now: free ? 'Tidak ada utang' : `Sisa ${rp(i.totalDebt)}`,
          todo: free ? '' : `Lunasi sisa utang ${rp(i.totalDebt)}`,
        },
        noExpense
          ? NO_EXPENSE
          : reach('Dana darurat 6 bulan', i.savings, i.avgExpense * 6, (gap) => `Tambah tabungan ${gap} lagi`),
      ];
    }
    default: {
      const k = ASSET_RATIO[level];
      if (k === undefined) return [];
      if (noExpense) return [NO_EXPENSE];
      const label = k === 0.5 ? 'Investasi ½ target aset' : k === 1 ? 'Investasi capai target aset' : `Investasi ${k}× target aset`;
      return [reach(label, i.productiveAssets, i.avgExpense * 12 * FIRE_MULTIPLIER * k, (gap) => `Tambah investasi ${gap} lagi`)];
    }
  }
}

export interface FreedomResult {
  level: number;
  current: LevelDef;
  next: LevelDef | null;
  /** Syarat level berikutnya beserta progresnya. */
  nextCriteria: Criterion[];
  /** 0–1, rata-rata progres syarat level berikutnya. */
  nextProgress: number;
  /** Langkah terdekat untuk naik level. '' kalau sudah level tertinggi. */
  nextStep: string;
  /** Aturan 4%: pengeluaran setahun × 25 (target Level 5). */
  targetAssets: number;
}

export function computeFreedomLevel(i: FreedomInput): FreedomResult {
  let level = 0;
  for (let l = 1; l <= 7; l++) {
    if (criteriaFor(l, i).every((c) => c.done)) level = l;
    else break;
  }
  const next = level < 7 ? LEVELS[level + 1] : null;
  const nextCriteria = next ? criteriaFor(next.level, i) : [];
  const nextProgress = nextCriteria.length
    ? nextCriteria.reduce((s, c) => s + c.progress, 0) / nextCriteria.length
    : 1;

  return {
    level,
    current: LEVELS[level],
    next,
    nextCriteria,
    nextProgress,
    nextStep: nextCriteria.find((c) => !c.done)?.todo ?? '',
    targetAssets: i.avgExpense * 12 * FIRE_MULTIPLIER,
  };
}
