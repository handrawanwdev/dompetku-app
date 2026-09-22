import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, RADIUS } from "../../../theme";

interface Props {
  count: number;
  onPress: () => void;
}

export function RemindersBell({ count, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name="notifications" size={ICON_SIZES.lg} color={COLORS.text} />
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
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.expense,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "800", color: "#FFFFFF" },
});
