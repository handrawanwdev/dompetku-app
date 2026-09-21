import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { DebtModel } from "../../../models/DebtModel";
import type { ReminderStatus } from "../../../utils/finance";

type Reminder = { debt: DebtModel; status: ReminderStatus };

interface Props {
  totalDebt: number;
  monthlyInstallment: number;
  urgent: Reminder[];
  normal: Reminder[];
  onPress: () => void;
}

/**
 * Glanceable "kewajiban apa" answer for the dashboard's 5-second scan —
 * doesn't require tapping the topbar bell to know if anything's due.
 */
export function ObligationsCard({ totalDebt, monthlyInstallment, urgent, normal, onPress }: Props) {
  if (totalDebt <= 0 && monthlyInstallment <= 0 && urgent.length === 0 && normal.length === 0) return null;

  const hasUrgent = urgent.length > 0;
  const nearest = urgent[0] ?? normal[0];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card} padding={SPACING.xl}>
        <View style={styles.header}>
          <Text style={styles.title}>💳 Kewajiban</Text>
          {hasUrgent ? (
            <View style={[styles.badge, { backgroundColor: COLORS.danger + "22" }]}>
              <Text style={[styles.badgeText, { color: COLORS.danger }]}>
                {urgent.length} perlu perhatian
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: COLORS.success + "22" }]}>
              <Text style={[styles.badgeText, { color: COLORS.success }]}>✅ Aman</Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Sisa Kewajiban</Text>
            <Text style={[styles.itemValue, { color: COLORS.debt }]}>
              {formatCompact(totalDebt)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Per Bulan</Text>
            <Text style={[styles.itemValue, { color: COLORS.warning }]}>
              {formatCompact(monthlyInstallment)}
            </Text>
          </View>
        </View>

        {nearest && (
          <View style={styles.nearestRow}>
            <Text style={styles.nearestName} numberOfLines={1}>{nearest.debt.name}</Text>
            <Text style={[styles.nearestStatus, { color: nearest.status.color }]} numberOfLines={1}>
              {nearest.status.label}
            </Text>
          </View>
        )}

        <Text style={styles.tapHint}>Tap untuk lihat semua ›</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACING.sm, borderColor: COLORS.border },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  item: { flex: 1, alignItems: "center" },
  itemLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  itemValue: { fontSize: FONTS.lg, fontWeight: "700", marginTop: 2 },
  divider: { width: 1, height: 36, backgroundColor: COLORS.border, marginTop: 4 },
  nearestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  nearestName: { flex: 1, fontSize: FONTS.sm, fontWeight: "600", color: COLORS.text },
  nearestStatus: { fontSize: FONTS.xs, fontWeight: "600" },
  tapHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: "right",
  },
});
