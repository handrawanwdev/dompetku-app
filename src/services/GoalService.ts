import Realm from 'realm';
import dayjs from 'dayjs';
import type { MaterialIcons } from '@expo/vector-icons';
import { GoalModel } from '../models/GoalModel';
import { ExpenseModel } from '../models/ExpenseModel';
import { COLORS } from '../theme';
import { today } from '../utils/date';

export const GOAL_ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  'flag',
  'home',
  'directions-car',
  'two-wheeler',
  'flight',
  'school',
  'phone-iphone',
  'laptop',
  'favorite',
  'celebration',
  'medical-services',
  'shield',
];

type Tagged = Pick<ExpenseModel, 'goalId' | 'amount' | 'kind' | 'source' | 'isInternal'>;

/** Setoran (jenis Tabungan) − pemakaian dana (dibayar pakai tabungan) yang ditandai goal ini. */
function savedFrom(rows: Iterable<Tagged>, goalId: string): { saved: number; used: number } {
  let deposit = 0;
  let used = 0;
  for (const e of rows) {
    if (e.goalId !== goalId || e.isInternal) continue;
    if (e.source === 'savings') used += e.amount;
    else if (e.kind === 'saving' && e.source !== 'adjust') deposit += e.amount;
  }
  return { saved: deposit - used, used };
}

export interface GoalInfo {
  goal: GoalModel;
  id: string;
  saved: number;
  remaining: number;
  /** 0-100, untuk ProgressBar. */
  progress: number;
  done: boolean;
  overdue: boolean;
  /** Bulan tersisa sampai tenggat (min 1). null = tanpa tenggat / sudah tercapai. */
  monthsLeft: number | null;
  /** Setoran per bulan supaya tercapai tepat waktu. */
  perMonth: number | null;
  /** Progres dibanding waktu yang sudah berjalan. null = tanpa tenggat / tercapai / lewat. */
  onTrack: boolean | null;
}

export function buildGoalInfo(goal: GoalModel, rows: Iterable<Tagged>, now = dayjs()): GoalInfo {
  const id = goal._id.toHexString();
  const { saved } = savedFrom(rows, id);
  const remaining = Math.max(goal.target - saved, 0);
  const done = Boolean(goal.doneAt) || (goal.target > 0 && saved >= goal.target);
  const todayStr = now.format('YYYY-MM-DD');
  const overdue = !done && Boolean(goal.deadline) && goal.deadline < todayStr;

  let monthsLeft: number | null = null;
  let perMonth: number | null = null;
  let onTrack: boolean | null = null;
  if (goal.deadline && !done && !overdue) {
    const end = dayjs(goal.deadline);
    monthsLeft = Math.max(1, Math.ceil(end.diff(now, 'month', true)));
    perMonth = remaining / monthsLeft;
    const start = dayjs(goal.createdAt).startOf('day');
    const total = Math.max(end.diff(start, 'day'), 1);
    const elapsed = Math.min(Math.max(now.diff(start, 'day'), 0), total);
    onTrack = saved >= goal.target * (elapsed / total);
  }

  return {
    goal,
    id,
    saved,
    remaining,
    progress: goal.target > 0 ? Math.min((Math.max(saved, 0) / goal.target) * 100, 100) : 0,
    done,
    overdue,
    monthsLeft,
    perMonth,
    onTrack,
  };
}

export function buildGoalInfos(goals: Iterable<GoalModel>, rows: Realm.Results<ExpenseModel> | Tagged[]): GoalInfo[] {
  const list = [...rows];
  return [...goals].map((g) => buildGoalInfo(g, list));
}

export function goalStatus(info: GoalInfo): { label: string; color: string; bg: string } | null {
  if (info.done) return { label: 'Tercapai', color: COLORS.successText, bg: COLORS.successBg };
  if (info.overdue) return { label: 'Lewat tenggat', color: COLORS.dangerText, bg: COLORS.dangerBg };
  if (info.onTrack === false) return { label: 'Tertinggal', color: COLORS.warningText, bg: COLORS.warningBg };
  if (info.onTrack) return { label: 'Sesuai jadwal', color: COLORS.infoText, bg: COLORS.infoBg };
  return null;
}

/** Sisa dana goal, tanpa menghitung baris yang sedang diedit. */
export function goalAvailable(realm: Realm, goalId: string, excludeId?: string): number {
  const rows = realm.objects(ExpenseModel).filtered('goalId == $0', goalId);
  const kept = excludeId ? [...rows].filter((e) => e._id.toHexString() !== excludeId) : rows;
  return savedFrom(kept, goalId).saved;
}

/**
 * Tandai tercapai saat target terkumpul. Kalau saldo turun di bawah target:
 * tetap tercapai bila dananya sudah dipakai, batal bila cuma koreksi setoran.
 * Return true kalau goal baru saja tercapai. Must run inside realm.write().
 */
export function syncGoalStatus(realm: Realm, goalId: string): boolean {
  if (!goalId) return false;
  const goal = realm.objectForPrimaryKey(GoalModel, new Realm.BSON.ObjectId(goalId));
  if (!goal) return false;
  const { saved, used } = savedFrom(realm.objects(ExpenseModel).filtered('goalId == $0', goalId), goalId);
  if (goal.target > 0 && saved >= goal.target) {
    if (goal.doneAt) return false;
    goal.doneAt = today();
    return true;
  }
  if (goal.doneAt && used === 0) goal.doneAt = '';
  return false;
}

/** Hapus goal. Transaksinya tetap ada, uangnya tetap di tabungan. Must run inside realm.write(). */
export function deleteGoal(realm: Realm, goal: GoalModel) {
  const id = goal._id.toHexString();
  for (const e of realm.objects(ExpenseModel).filtered('goalId == $0', id)) e.goalId = '';
  realm.delete(goal);
}
