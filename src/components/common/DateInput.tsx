import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

interface DateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
}

const WEEKDAYS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const YEAR_RANGE = { past: 80, future: 15 };
const YEAR_CHIP_WIDTH = 68;

function buildCalendarDays(monthCursor: dayjs.Dayjs) {
  const startOfMonth = monthCursor.startOf('month');
  const endOfMonth = monthCursor.endOf('month');
  const leadingBlanks = startOfMonth.day(); // 0=Sunday
  const days: (dayjs.Dayjs | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) days.push(null);
  for (let d = 0; d < endOfMonth.date(); d++) {
    days.push(startOfMonth.add(d, 'day'));
  }
  return days;
}

export function DateInput({ label, value, onChange, error }: DateInputProps) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'day' | 'monthYear'>('day');
  const selected = value ? dayjs(value) : dayjs();
  const [cursor, setCursor] = useState(selected.startOf('month'));

  const days = useMemo(() => buildCalendarDays(cursor), [cursor]);
  const years = useMemo(() => {
    const nowYear = dayjs().year();
    const list: number[] = [];
    for (let y = nowYear - YEAR_RANGE.past; y <= nowYear + YEAR_RANGE.future; y++) {
      list.push(y);
    }
    return list;
  }, []);
  const yearScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (mode !== 'monthYear') return;
    const idx = years.indexOf(cursor.year());
    if (idx < 0) return;
    yearScrollRef.current?.scrollTo({
      x: Math.max(0, idx * YEAR_CHIP_WIDTH - YEAR_CHIP_WIDTH * 2),
      animated: false,
    });
  }, [mode]);

  const open = () => {
    setCursor((value ? dayjs(value) : dayjs()).startOf('month'));
    setMode('day');
    setVisible(true);
  };

  const pick = (d: dayjs.Dayjs) => {
    onChange(d.format('YYYY-MM-DD'));
    setVisible(false);
  };

  const pickYear = (y: number) => {
    setCursor(cursor.year(y));
  };

  const pickMonth = (m: number) => {
    setCursor(cursor.month(m));
    setMode('day');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={[styles.field, error && styles.fieldError]} onPress={open}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? dayjs(value).format('D MMMM YYYY') : 'Pilih tanggal'}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.calendarCard} onPress={() => {}}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() =>
                  setCursor(cursor.subtract(1, mode === 'day' ? 'month' : 'year'))
                }
                style={styles.navBtn}
              >
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode(mode === 'day' ? 'monthYear' : 'day')}>
                <Text style={styles.monthLabel}>
                  {cursor.format('MMMM YYYY')} {mode === 'day' ? '▾' : '▴'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setCursor(cursor.add(1, mode === 'day' ? 'month' : 'year'))
                }
                style={styles.navBtn}
              >
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {mode === 'monthYear' ? (
              <>
                <ScrollView
                  ref={yearScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.yearScroll}
                  contentContainerStyle={styles.yearScrollContent}
                >
                  {years.map((y) => {
                    const isActive = y === cursor.year();
                    return (
                      <TouchableOpacity
                        key={y}
                        style={[styles.yearChip, isActive && styles.yearChipActive]}
                        onPress={() => pickYear(y)}
                      >
                        <Text style={[styles.yearChipText, isActive && styles.yearChipTextActive]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.monthGrid}>
                  {MONTH_NAMES.map((m, i) => {
                    const isActive = i === cursor.month();
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.monthCell, isActive && styles.monthCellActive]}
                        onPress={() => pickMonth(i)}
                      >
                        <Text style={[styles.monthCellText, isActive && styles.monthCellTextActive]}>
                          {m.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
                <View style={styles.weekRow}>
                  {WEEKDAYS.map((w, i) => (
                    <Text key={i} style={styles.weekLabel}>{w}</Text>
                  ))}
                </View>

                <View style={styles.grid}>
                  {days.map((d, i) => {
                    if (!d) return <View key={i} style={styles.dayCell} />;
                    const isSelected = d.format('YYYY-MM-DD') === selected.format('YYYY-MM-DD');
                    const isToday = d.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                        onPress={() => pick(d)}
                      >
                        <Text style={[
                          styles.dayText,
                          isToday && !isSelected && styles.dayTextToday,
                          isSelected && styles.dayTextSelected,
                        ]}>
                          {d.date()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.todayBtn} onPress={() => pick(dayjs())}>
                  <Text style={styles.todayBtnText}>Hari ini</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  fieldError: { borderColor: COLORS.danger },
  value: { fontSize: FONTS.md, color: COLORS.text },
  placeholder: { fontSize: FONTS.md, color: COLORS.textMuted },
  calendarIcon: { fontSize: FONTS.md },
  errorText: { fontSize: FONTS.sm, color: COLORS.danger, marginTop: 4 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.subtleBg,
  },
  navBtnText: { fontSize: FONTS.xl, color: COLORS.text, fontWeight: '700' },
  monthLabel: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, textTransform: 'capitalize' },
  weekRow: { flexDirection: 'row', marginBottom: SPACING.xs },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {},
  dayText: { fontSize: FONTS.md, color: COLORS.text },
  dayTextToday: { color: COLORS.primary, fontWeight: '700' },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    textAlign: 'center',
    lineHeight: 32,
    overflow: 'hidden',
  },
  todayBtn: { marginTop: SPACING.md, alignItems: 'center', paddingVertical: SPACING.sm },
  todayBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sm },

  yearScroll: { marginBottom: SPACING.md, flexGrow: 0, flexShrink: 0 },
  yearScrollContent: { gap: SPACING.xs, paddingHorizontal: 2 },
  yearChip: {
    width: YEAR_CHIP_WIDTH - 8,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    backgroundColor: COLORS.subtleBg,
  },
  yearChipActive: { backgroundColor: COLORS.primary },
  yearChipText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
  yearChipTextActive: { color: '#ffffff' },

  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  monthCell: {
    width: `${100 / 3 - 2}%`,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    backgroundColor: COLORS.subtleBg,
  },
  monthCellActive: { backgroundColor: COLORS.primary },
  monthCellText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
  monthCellTextActive: { color: '#ffffff' },
});
