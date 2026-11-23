import React from "react";
import { StyleSheet, Text as RNText, View } from "react-native";
import dayjs from "dayjs";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { SectionTitle } from "./SectionTitle";

export type DailyTotals = Record<string, { income: number; expense: number }>;

interface Props {
  /** Key: YYYY-MM-DD, hanya hari di bulan berjalan yang punya transaksi. */
  data: DailyTotals;
}

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Versi pendek formatCompact untuk sel kalender yang sempit: 1jt, 1,2jt, 150rb
function short(n: number): string {
  const fmt = (v: number) => v.toFixed(1).replace(/\.0$/, "").replace(".", ",");
  if (n >= 1_000_000_000) return `${fmt(n / 1_000_000_000)}M`;
  if (n >= 1_000_000) return `${fmt(n / 1_000_000)}jt`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}rb`;
  return String(n);
}

export function CashflowCalendarCard({ data }: Props) {
  const now = dayjs();
  const todayStr = now.format("YYYY-MM-DD");
  const start = now.startOf("month");
  const leading = start.day(); // 0 = Minggu
  const total = start.daysInMonth();

  const cells: (dayjs.Dayjs | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: total }, (_, i) => start.add(i, "day")),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      <SectionTitle icon="calendar-month">Kalender {now.format("MMMM")}</SectionTitle>
      <Card padding={SPACING.md}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.income }]} />
            <Text style={styles.legendText}>Masuk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.expense }]} />
            <Text style={styles.legendText}>Keluar</Text>
          </View>
        </View>

        <View style={styles.row}>
          {WEEKDAYS.map((w) => (
            <Text key={w} style={styles.weekLabel}>
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
            return (
              <View key={i} style={styles.cell}>
                <View style={[styles.cellInner, isToday && styles.cellToday]}>
                  <Text
                    style={[
                      styles.dayNum,
                      isFuture && styles.dayNumFuture,
                      isToday && styles.dayNumToday,
                    ]}
                  >
                    {d.date()}
                  </Text>
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
                </View>
              </View>
            );
          })}
        </View>
      </Card>
    </>
  );
}

const CELL_W = "14.2857%";

const styles = StyleSheet.create({
  legend: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: RADIUS.round },
  legendText: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  row: { flexDirection: "row" },
  weekLabel: {
    width: CELL_W,
    textAlign: "center",
    fontSize: FONTS.xs,
    fontWeight: "600",
    color: COLORS.textMuted,
    paddingVertical: SPACING.xs,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: CELL_W, padding: 2 },
  cellInner: {
    minHeight: 52,
    borderRadius: RADIUS.sm,
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cellToday: { borderColor: COLORS.primary },
  dayNum: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.text },
  dayNumFuture: { color: COLORS.textMuted, fontWeight: "400" },
  dayNumToday: { color: COLORS.primary, fontWeight: "800" },
  amount: { fontSize: FONTS.xs, fontWeight: "700", marginTop: 1, alignSelf: "stretch", textAlign: "center" },
});
