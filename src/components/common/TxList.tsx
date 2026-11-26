import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import '../../utils/date'; // locale dayjs 'id'
import { Text } from './Text';

// Komponen daftar transaksi per hari, dipakai di Transaksi & detail kantong.

export interface DaySection<T> {
  date: string;
  total: number;
  data: T[];
}

/** Kelompokkan item (sudah urut tanggal) per hari, plus total bertanda per hari. */
export function groupByDate<T>(items: T[], dateOf: (i: T) => string, signed: (i: T) => number): DaySection<T>[] {
  const sections: DaySection<T>[] = [];
  for (const it of items) {
    const date = dateOf(it);
    let s = sections[sections.length - 1];
    if (!s || s.date !== date) {
      s = { date, total: 0, data: [] };
      sections.push(s);
    }
    s.data.push(it);
    s.total += signed(it);
  }
  return sections;
}

export function dayLabel(date: string, withYear = false): string {
  const d = dayjs(date);
  const today = dayjs();
  if (d.isSame(today, 'day')) return 'Hari ini';
  if (d.isSame(today.subtract(1, 'day'), 'day')) return 'Kemarin';
  return d.format(withYear && !d.isSame(today, 'year') ? 'dddd, D MMM YYYY' : 'dddd, D MMM');
}

/** `total` null = tidak ditampilkan (mis. hari itu cuma ada pindah saldo). */
export function DayHeader({ date, total, withYear }: { date: string; total: number | null; withYear?: boolean }) {
  return (
    <View style={styles.dayHeader}>
      <Text style={styles.dayLabel}>{dayLabel(date, withYear)}</Text>
      {total !== null && (
        <Text style={styles.dayTotal}>
          {total >= 0 ? '+' : '−'}
          {formatCurrency(Math.abs(total))}
        </Text>
      )}
    </View>
  );
}

interface TxRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; color: string };
  amount: string;
  amountColor: string;
  /** Posisi di dalam grup hari: baris satu hari tergabung jadi satu kartu. */
  first: boolean;
  last: boolean;
  onPress?: () => void;
}

export function TxRow({ icon, iconBg, title, subtitle, badge, amount, amountColor, first, last, onPress }: TxRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.6}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[styles.row, first && styles.rowFirst, last && styles.rowLast, !first && styles.rowDivider]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.rowInfo}>
        <View style={styles.rowTitleLine}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: badge.color + '1A' }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <Text style={styles.rowSub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.rowAmount, { color: amountColor }]} numberOfLines={1}>
        {amount}
      </Text>
    </TouchableOpacity>
  );
}

export const TX_ICON_SIZE = 40;

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  dayLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.text },
  dayTotal: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.textSecondary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  rowFirst: { borderTopWidth: 1, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg },
  rowLast: { borderBottomWidth: 1, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  rowDivider: { borderTopWidth: 1, borderTopColor: COLORS.subtleBg },
  rowIcon: {
    width: TX_ICON_SIZE,
    height: TX_ICON_SIZE,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: { flex: 1 },
  rowTitleLine: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowTitle: { flexShrink: 1, fontSize: FONTS.md, fontWeight: '600', color: COLORS.text },
  rowSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  rowAmount: { fontSize: FONTS.md, fontWeight: '700' },
  badge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: RADIUS.sm },
  badgeText: { fontSize: FONTS.xs, fontWeight: '600' },
});
