import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export const formatDate = (date: string | Date, fmt = 'DD MMM YYYY') =>
  dayjs(date).format(fmt);

export const formatDateShort = (date: string | Date) =>
  dayjs(date).format('DD/MM/YY');

export const formatMonth = (date: string | Date) =>
  dayjs(date).format('MMM YYYY');

export const today = () => dayjs().format('YYYY-MM-DD');

export const startOfMonth = (date?: string | Date) =>
  dayjs(date).startOf('month').format('YYYY-MM-DD');

export const endOfMonth = (date?: string | Date) =>
  dayjs(date).endOf('month').format('YYYY-MM-DD');

export const startOfYear = (date?: string | Date) =>
  dayjs(date).startOf('year').format('YYYY-MM-DD');

export const monthsAgo = (n: number) =>
  dayjs().subtract(n, 'month').format('YYYY-MM-DD');

export const daysAgo = (n: number) =>
  dayjs().subtract(n, 'day').format('YYYY-MM-DD');

export const isOverdue = (dueDate: number): boolean => {
  const today = dayjs().date();
  return today > dueDate;
};

export const daysUntilDue = (dueDate: number): number => {
  const today = dayjs().date();
  const daysInMonth = dayjs().daysInMonth();
  if (today <= dueDate) return dueDate - today;
  return daysInMonth - today + dueDate;
};

export const estimatedCompletion = (
  target: number,
  current: number,
  monthlyContribution: number
): string | null => {
  if (monthlyContribution <= 0) return null;
  const remaining = target - current;
  if (remaining <= 0) return 'Tercapai';
  const months = Math.ceil(remaining / monthlyContribution);
  return dayjs().add(months, 'month').format('MMM YYYY');
};
