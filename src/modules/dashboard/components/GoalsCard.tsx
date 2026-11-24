import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, ProgressBar, Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import { goalStatus } from "../../../services/GoalService";
import { useRootNavigation } from "../../../navigation/types";
import { useGoals } from "../../goal/useGoals";

const MAX = 3;

/** Goal aktif terdekat tenggatnya. Kosong = ajakan bikin goal pertama. */
export function GoalsCard() {
  const nav = useRootNavigation();
  const active = useGoals()
    .filter((g) => !g.done)
    .sort((a, b) => (a.goal.deadline || "9999").localeCompare(b.goal.deadline || "9999"));
  const shown = active.slice(0, MAX);

  return (
    <>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <MaterialIcons name="flag" size={ICON_SIZES.sm} color={COLORS.primary} />
          <Text style={styles.title}>Goal</Text>
        </View>
        {active.length > 0 && (
          <TouchableOpacity onPress={() => nav.navigate("Goals")} hitSlop={8}>
            <Text style={styles.link}>Lihat semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {shown.length === 0 ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => nav.navigate("Goals", { screen: "GoalForm", params: {} })}
        >
          <Card padding={SPACING.lg} style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="add" size={ICON_SIZES.lg} color={COLORS.saving} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyTitle}>Buat goal pertama</Text>
              <Text style={styles.emptySub}>Dana darurat, liburan, DP rumah. Progres terisi dari setoran Tabungan.</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ) : (
        <Card padding={SPACING.lg}>
          {shown.map((g, i) => {
            const status = goalStatus(g);
            return (
              <TouchableOpacity
                key={g.id}
                activeOpacity={0.7}
                onPress={() => nav.navigate("Goals", { screen: "GoalDetail", params: { id: g.id } })}
                style={[styles.item, i > 0 && styles.itemBorder]}
              >
                <View style={styles.itemHead}>
                  <MaterialIcons
                    name={g.goal.icon as keyof typeof MaterialIcons.glyphMap}
                    size={ICON_SIZES.sm}
                    color={COLORS.saving}
                  />
                  <Text style={styles.itemName} numberOfLines={1}>{g.goal.name}</Text>
                  {status && (
                    <View style={[styles.badge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  )}
                </View>
                <ProgressBar progress={g.progress} color={COLORS.saving} height={6} style={{ marginTop: SPACING.sm }} />
                <View style={styles.itemFoot}>
                  <Text style={styles.itemSub}>
                    {formatCurrency(Math.max(g.saved, 0))} / {formatCurrency(g.goal.target)}
                  </Text>
                  {g.perMonth ? (
                    <Text style={styles.itemSub}>{formatCurrency(Math.ceil(g.perMonth))}/bln</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  title: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text },
  link: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.primary },
  empty: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.saving + "1A",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.text },
  emptySub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  item: { paddingVertical: SPACING.sm },
  itemBorder: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.xs, paddingTop: SPACING.md },
  itemHead: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  itemName: { flex: 1, fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.round },
  badgeText: { fontSize: FONTS.xs, fontWeight: "700" },
  itemFoot: { flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.xs },
  itemSub: { fontSize: FONTS.sm, color: COLORS.textSecondary },
});
