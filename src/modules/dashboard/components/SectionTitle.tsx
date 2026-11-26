import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, SPACING } from "../../../theme";

interface Props {
  icon?: keyof typeof MaterialIcons.glyphMap;
  children: React.ReactNode;
  /** Tautan kecil di kanan, mis. "Lihat semua". */
  action?: { label: string; onPress: () => void };
}

/** Judul seksi dashboard: ikon + judul, opsional tautan di kanan. */
export function SectionTitle({ icon, children, action }: Props) {
  return (
    <View style={styles.row}>
      {icon && <MaterialIcons name={icon} size={ICON_SIZES.sm} color={COLORS.primary} />}
      <Text style={styles.title}>{children}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress} hitSlop={8} accessibilityRole="button">
          <Text style={styles.link}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  title: { flex: 1, fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text },
  link: { fontSize: FONTS.sm, fontWeight: "600", color: COLORS.primary },
});
