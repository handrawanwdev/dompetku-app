import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";

export function QuickActions() {
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: COLORS.income }]}
        onPress={() =>
          navigation.navigate(
            "Transaction" as never,
            { screen: "IncomeForm", params: {} } as never,
          )
        }
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>💵</Text>
        <Text style={styles.text}>+ Pemasukan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: COLORS.expense }]}
        onPress={() =>
          navigation.navigate(
            "Transaction" as never,
            { screen: "ExpenseForm", params: {} } as never,
          )
        }
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>🛒</Text>
        <Text style={styles.text}>+ Pengeluaran</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.sm },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  icon: { fontSize: 16 },
  text: { fontSize: FONTS.sm, fontWeight: "700", color: "#ffffff" },
});
