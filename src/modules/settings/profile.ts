import dayjs from 'dayjs';
import type { AppSettings } from '../../types';
import { getBirthdayInfo } from '../../utils/birthday';

/** Isian profil yang dihitung untuk kelengkapan, urut seperti di form. */
const FIELDS: { label: string; filled: (s: AppSettings) => boolean }[] = [
  { label: 'Nama panggilan', filled: (s) => Boolean(s.displayName?.trim()) },
  { label: 'Nama lengkap', filled: (s) => Boolean(s.fullName?.trim()) },
  { label: 'Ulang tahun', filled: (s) => Boolean(s.birthday) },
  { label: 'Bio', filled: (s) => Boolean(s.bio?.trim()) },
  { label: 'Pekerjaan', filled: (s) => Boolean(s.occupation?.trim()) },
  { label: 'Kota', filled: (s) => Boolean(s.city?.trim()) },
  { label: 'Fokus keuangan', filled: (s) => (s.financialFocus?.length ?? 0) > 0 },
];

export function profileCompleteness(s: AppSettings) {
  const missing = FIELDS.filter((f) => !f.filled(s)).map((f) => f.label);
  return { percent: Math.round(((FIELDS.length - missing.length) / FIELDS.length) * 100), missing };
}

/** Umur sekarang. null kalau tanggal lahir kosong/tidak valid. */
export function currentAge(birthday: string | undefined): number | null {
  const info = getBirthdayInfo(birthday);
  if (!info) return null;
  return info.isToday ? info.turningAge : info.turningAge - 1;
}

/** "12 Mei 1999 · 27 tahun", plus hitung mundur kalau ulang tahun sudah dekat. */
export function birthdayLine(birthday: string | undefined): { value: string; note?: string } | null {
  const info = getBirthdayInfo(birthday);
  if (!info) return null;
  const age = currentAge(birthday);
  const value = [dayjs(birthday).format('D MMMM YYYY'), age !== null && age >= 0 ? `${age} tahun` : null]
    .filter(Boolean)
    .join(' · ');
  if (info.isToday) return { value, note: 'Hari ini ulang tahunmu 🎂' };
  if (info.daysUntil <= 30) return { value, note: `${info.daysUntil} hari lagi ulang tahun ke-${info.turningAge}` };
  return { value };
}
