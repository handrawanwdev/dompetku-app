import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCompact } from "../../../utils/currency";
import type { DebtModel } from "../../../models/DebtModel";
import type { ReminderStatus } from "../../../utils/finance";
import { SectionTitle } from "./SectionTitle";

type Reminder = { debt: DebtModel; status: ReminderStatus };

interface Props {
  urgent: Reminder[];
  normal: Reminder[];
  paid: Reminder[];
}

export function RemindersSection({ urgent, normal, paid }: Props) {
  if (urgent.length === 0 && normal.length === 0 && paid.length === 0) return null;

  return (
    <>
      <SectionTitle icon="notifications">Pengingat Pembayaran</SectionTitle>
      {urgent.map(({ debt: d, status }) => (
        <View
          key={d._id.toHexString()}
          style={[styles.tierRow, { backgroundColor: status.bg }]}
        >
          <View style={[styles.iconBadge, { backgroundColor: COLORS.card }]}>
            <MaterialIcons name="warning" size={ICON_SIZES.sm} color={status.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tierLabel, { color: status.color }]}>
              {status.label}
            </Text>
            <Text style={styles.tierSub}>
              {d.name} — {formatCompact(d.monthlyInstallment)}
            </Text>
          </View>
        </View>
      ))}
      {normal.map(({ debt: d, status }) => (
        <View key={d._id.toHexString()} style={styles.plainRow}>
          <View style={[styles.iconBadge, { backgroundColor: COLORS.subtleBg }]}>
            <MaterialIcons name="schedule" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.plainName}>{d.name}</Text>
            <Text style={styles.plainSub}>
              {status.label} · {formatCompact(d.monthlyInstallment)}
            </Text>
          </View>
          <View style={styles.tagBlue}>
            <Text style={styles.tagBlueText}>Belum bayar</Text>
          </View>
        </View>
      ))}
      {paid.length > 0 && (
        <View style={{ marginTop: SPACING.sm }}>
          <Text style={styles.paidLabel}>Sudah Dibayar Bulan Ini</Text>
          {paid.map(({ debt: d }) => (
            <View key={d._id.toHexString()} style={styles.paidRow}>
              <Text style={styles.paidName}>{d.name}</Text>
              <View style={styles.paidCheckRow}>
                <MaterialIcons name="check-circle" size={ICON_SIZES.xs} color={COLORS.income} />
                <Text style={styles.paidCheck}>Lunas</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  tierRow: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  tierLabel: { fontSize: FONTS.sm, fontWeight: "700" },
  tierSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },

  plainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  plainName: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.text },
  plainSub: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 1 },
  tagBlue: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  tagBlueText: { fontSize: FONTS.xs, fontWeight: "700", color: "#1e40af" },

  paidLabel: {
    fontSize: FONTS.xs,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  paidRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 3 },
  paidName: { fontSize: FONTS.xs, color: COLORS.textMuted },
  paidCheckRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  paidCheck: { fontSize: FONTS.xs, color: COLORS.income, fontWeight: "600" },
});
