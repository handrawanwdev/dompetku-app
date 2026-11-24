import React, { useMemo, useState } from "react";
import { StyleSheet, Text as RNText, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@realm/react";
import dayjs from "dayjs";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { IncomeModel } from "../../../models/IncomeModel";
import { ExpenseModel } from "../../../models/ExpenseModel";
import { kindMeta } from "../../../utils/budget";
import { formatCurrency } from "../../../utils/currency";
import { EXCLUDE_NON_EARNED, isLockedIncome } from "../../../utils/journal";
import { useRootNavigation } from "../../../navigation/types";
import { SectionTitle } from "./SectionTitle";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Sama dengan ringkasan dashboard: pemasukan hasil kerja/usaha (tanpa saldo awal,
// pinjaman, baris internal) dan uang keluar yang benar-benar terpakai (tanpa
// Tabungan/Investasi yang cuma disisihkan).
const INCOME_FILTER = `date >= $0 AND date <= $1 AND isInternal == false AND ${EXCLUDE_NON_EARNED}`;
const EXPENSE_FILTER = 'date >= $0 AND date <= $1 AND isInternal == false AND kind != "saving" AND kind != "invest"';

// Versi pendek formatCompact untuk sel kalender yang sempit: 1jt, 1,2jt, 150rb
function short(n: number): string {
  const fmt = (v: number) => v.toFixed(1).replace(/\.0$/, "").replace(".", ",");
  if (n >= 1_000_000_000) return `${fmt(n / 1_000_000_000)}M`;
  if (n >= 1_000_000) return `${fmt(n / 1_000_000)}jt`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}rb`;
  return String(n);
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

interface DayEntry {
  key: string;
  label: string;
  note: string;
  amount: number;
  income: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  open?: () => void;
}

export function CashflowCalendarCard() {
  const nav = useRootNavigation();
  const thisMonth = dayjs().startOf("month");
  const todayStr = dayjs().format("YYYY-MM-DD");
  const [month, setMonth] = useState(thisMonth);
  const [selected, setSelected] = useState(todayStr);

  const from = month.format("YYYY-MM-DD");
  const to = month.endOf("month").format("YYYY-MM-DD");
  const incomes = useQuery(IncomeModel, (c) => c.filtered(INCOME_FILTER, from, to), [from, to]);
  const expenses = useQuery(ExpenseModel, (c) => c.filtered(EXPENSE_FILTER, from, to), [from, to]);

  const data = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const i of incomes) (map[i.date] ??= { income: 0, expense: 0 }).income += i.amount;
    for (const e of expenses) (map[e.date] ??= { income: 0, expense: 0 }).expense += e.amount;
    return map;
  }, [incomes, expenses]);

  const sumIn = incomes.sum("amount") ?? 0;
  const sumOut = expenses.sum("amount") ?? 0;
  const net = sumIn - sumOut;

  const dayEntries = useMemo<DayEntry[]>(() => {
    const out: DayEntry[] = [];
    for (const i of incomes.filtered("date == $0", selected)) {
      out.push({
        key: "i" + i._id.toHexString(),
        label: i.category,
        note: i.note,
        amount: i.amount,
        income: true,
        icon: "south-west",
        color: COLORS.income,
        open: isLockedIncome(i) ? undefined : () => nav.navigate("IncomeForm", { id: i._id.toHexString() }),
      });
    }
    for (const e of expenses.filtered("date == $0", selected)) {
      const m = kindMeta(e.kind);
      out.push({
        key: "e" + e._id.toHexString(),
        label: e.category,
        note: e.note,
        amount: e.amount,
        income: false,
        icon: m.icon,
        color: m.color,
        open: () => nav.navigate("ExpenseForm", { id: e._id.toHexString() }),
      });
    }
    return out;
  }, [incomes, expenses, selected, nav]);

  const leading = month.day(); // 0 = Minggu
  const cells: (dayjs.Dayjs | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: month.daysInMonth() }, (_, i) => month.add(i, "day")),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isThisMonth = month.isSame(thisMonth, "month");
  const goMonth = (delta: number) => {
    const next = month.add(delta, "month");
    if (next.isAfter(thisMonth, "month")) return;
    setMonth(next);
    // Pilih hari ini kalau balik ke bulan berjalan, selain itu tanggal 1.
    setSelected(next.isSame(thisMonth, "month") ? todayStr : next.format("YYYY-MM-DD"));
  };
  const selectedTotals = data[selected];

  return (
    <>
      <SectionTitle icon="calendar-month">Kalender</SectionTitle>
      <Card padding={SPACING.md}>
        <View style={styles.monthNav}>
          <TouchableOpacity
            onPress={() => goMonth(-1)}
            style={styles.navBtn}
            hitSlop={8}
            accessibilityLabel="Bulan sebelumnya"
          >
            <MaterialIcons name="chevron-left" size={ICON_SIZES.xl} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => !isThisMonth && goMonth(thisMonth.diff(month, "month"))}
            disabled={isThisMonth}
            style={styles.monthLabelWrap}
          >
            <Text style={styles.monthLabel}>{month.format("MMMM YYYY")}</Text>
            {!isThisMonth && <Text style={styles.backToday}>Kembali ke bulan ini</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goMonth(1)}
            disabled={isThisMonth}
            style={[styles.navBtn, isThisMonth && styles.navBtnDisabled]}
            hitSlop={8}
            accessibilityLabel="Bulan berikutnya"
          >
            <MaterialIcons name="chevron-right" size={ICON_SIZES.xl} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <Stat label="Masuk" value={`+${short(sumIn)}`} color={COLORS.income} />
          <View style={styles.divider} />
          <Stat label="Keluar" value={`-${short(sumOut)}`} color={COLORS.expense} />
          <View style={styles.divider} />
          <Stat
            label="Selisih"
            value={`${net < 0 ? "-" : "+"}${short(Math.abs(net))}`}
            color={net < 0 ? COLORS.expense : COLORS.income}
          />
        </View>

        <View style={styles.row}>
          {WEEKDAYS.map((w, i) => (
            <Text key={w} style={[styles.weekLabel, i === 0 && styles.weekLabelSunday]}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((d, i) => {
            if (!d) return <View key={i} style={styles.cell} />;
            const key = d.format("YYYY-MM-DD");
            const t = data[key];
            const isToday = key === todayStr;
            const isFuture = key > todayStr;
            const isSelected = key === selected;
            const isSunday = d.day() === 0;
            const tint = !t ? null : t.income - t.expense >= 0 ? styles.cellPositive : styles.cellNegative;
            return (
              <View key={i} style={styles.cell}>
                <TouchableOpacity
                  onPress={() => setSelected(key)}
                  disabled={isFuture}
                  activeOpacity={0.6}
                  style={[styles.cellInner, tint, isFuture && styles.cellFuture, isSelected && styles.cellSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={d.format("D MMMM")}
                >
                  <View style={[styles.dayBadge, isToday && styles.dayBadgeToday]}>
                    <Text
                      style={[
                        styles.dayNum,
                        isSunday && styles.dayNumSunday,
                        isToday && styles.dayNumToday,
                      ]}
                    >
                      {d.date()}
                    </Text>
                  </View>
                  {t && t.income > 0 && (
                    <RNText
                      style={[styles.amount, { color: COLORS.income }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      +{short(t.income)}
                    </RNText>
                  )}
                  {t && t.expense > 0 && (
                    <RNText
                      style={[styles.amount, { color: COLORS.expense }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      -{short(t.expense)}
                    </RNText>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Detail hari terpilih */}
        <View style={styles.detail}>
          <View style={styles.detailHead}>
            <Text style={styles.detailTitle}>
              {selected === todayStr ? "Hari ini" : dayjs(selected).format("dddd, D MMMM")}
            </Text>
            {selectedTotals && (
              <Text
                style={[
                  styles.detailNet,
                  { color: selectedTotals.income - selectedTotals.expense < 0 ? COLORS.expense : COLORS.income },
                ]}
              >
                {selectedTotals.income - selectedTotals.expense < 0 ? "- " : "+ "}
                {formatCurrency(Math.abs(selectedTotals.income - selectedTotals.expense))}
              </Text>
            )}
          </View>
          {dayEntries.length === 0 ? (
            <Text style={styles.detailEmpty}>Tidak ada uang masuk atau keluar.</Text>
          ) : (
            dayEntries.map((e) => (
              <TouchableOpacity
                key={e.key}
                style={styles.entry}
                onPress={e.open}
                disabled={!e.open}
                activeOpacity={0.7}
              >
                <View style={[styles.entryIcon, { backgroundColor: e.color + "1A" }]}>
                  <MaterialIcons name={e.icon} size={ICON_SIZES.sm} color={e.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryLabel} numberOfLines={1}>{e.label}</Text>
                  {e.note ? <Text style={styles.entryNote} numberOfLines={1}>{e.note}</Text> : null}
                </View>
                <Text style={[styles.entryAmount, { color: e.income ? COLORS.income : COLORS.expense }]}>
                  {e.income ? "+ " : "- "}
                  {formatCurrency(e.amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Card>
    </>
  );
}

const CELL_W = "14.2857%";
const BADGE = 22;

const styles = StyleSheet.create({
  monthNav: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm },
  navBtn: { width: 36, height: 36, borderRadius: RADIUS.round, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.subtleBg },
  navBtnDisabled: { opacity: 0.3 },
  monthLabelWrap: { flex: 1, alignItems: "center" },
  monthLabel: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text },
  backToday: { fontSize: FONTS.xs, fontWeight: "600", color: COLORS.primary, marginTop: 1 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  stat: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginBottom: 2 },
  statValue: { fontSize: FONTS.md, fontWeight: "800" },
  divider: { width: 1, alignSelf: "stretch", backgroundColor: COLORS.border },
  row: { flexDirection: "row", marginBottom: 2 },
  weekLabel: {
    width: CELL_W,
    textAlign: "center",
    fontSize: FONTS.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    paddingVertical: SPACING.xs,
  },
  weekLabelSunday: { color: COLORS.expense },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: CELL_W, padding: 2 },
  cellInner: {
    minHeight: 54,
    borderRadius: RADIUS.sm,
    paddingTop: 4,
    paddingBottom: 3,
    paddingHorizontal: 2,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cellPositive: { backgroundColor: COLORS.successBg },
  cellNegative: { backgroundColor: COLORS.dangerBg },
  cellFuture: { opacity: 0.4 },
  cellSelected: { borderColor: COLORS.primary },
  dayBadge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  dayBadgeToday: { backgroundColor: COLORS.primary },
  dayNum: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.text },
  dayNumSunday: { color: COLORS.expense },
  dayNumToday: { color: COLORS.onPrimary, fontWeight: "800" },
  amount: {
    fontSize: 9,
    fontWeight: "700",
    alignSelf: "stretch",
    textAlign: "center",
    lineHeight: 12,
  },
  detail: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.xs },
  detailTitle: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  detailNet: { fontSize: FONTS.md, fontWeight: "800" },
  detailEmpty: { fontSize: FONTS.sm, color: COLORS.textSecondary, paddingVertical: SPACING.sm },
  entry: { flexDirection: "row", alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.sm },
  entryIcon: { width: 32, height: 32, borderRadius: RADIUS.round, alignItems: "center", justifyContent: "center" },
  entryLabel: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  entryNote: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 1 },
  entryAmount: { fontSize: FONTS.md, fontWeight: "700" },
});
