import dayjs from 'dayjs';

export interface BirthdayInfo {
  isToday: boolean;
  /** Hari menuju ulang tahun berikutnya (0 = hari ini). */
  daysUntil: number;
  /** Umur yang dirayakan pada ulang tahun berikutnya. */
  turningAge: number;
  month: number; // 1–12
  day: number;
}

/** 29 Feb dirayakan 28 Feb di tahun yang bukan kabisat. */
function birthdayInYear(month: number, day: number, year: number) {
  const d = dayjs(new Date(year, month - 1, 1));
  return d.date(Math.min(day, d.daysInMonth()));
}

export function getBirthdayInfo(birthday: string | undefined, now: Date = new Date()): BirthdayInfo | null {
  if (!birthday) return null;
  const b = dayjs(birthday);
  if (!b.isValid()) return null;
  const month = b.month() + 1;
  const day = b.date();
  const today = dayjs(now).startOf('day');

  let next = birthdayInYear(month, day, today.year());
  if (next.isBefore(today, 'day')) next = birthdayInYear(month, day, today.year() + 1);
  const daysUntil = next.diff(today, 'day');

  return { isToday: daysUntil === 0, daysUntil, turningAge: next.year() - b.year(), month, day };
}

const WISHES = [
  'Semoga tahun ini rezekimu lancar, badan sehat, dan hati tenang. Hari ini boleh kok sedikit memanjakan diri.',
  'Terima kasih sudah rajin merawat keuanganmu. Semoga semua yang kamu usahakan tahun ini jadi kenyataan.',
  'Satu tahun lagi makin dewasa dan makin kuat. Rayakan dengan cara yang bikin kamu senang, ya.',
  'Semoga tahun barumu penuh kabar baik, orang-orang baik, dan tabungan yang terus bertambah.',
];

/** Ucapan berganti tiap tahun supaya tidak terasa template. */
export function birthdayWish(year: number = new Date().getFullYear()) {
  return WISHES[year % WISHES.length];
}
