import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS } from "../../../theme";

interface Props {
  count: number;
  onPress: () => void;
}

export function RemindersBell({ count, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>🔔</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.expense,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: FONTS.xs, fontWeight: "700", color: "#fff" },
});
