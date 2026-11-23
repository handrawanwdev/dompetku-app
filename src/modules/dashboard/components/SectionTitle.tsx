import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/common";
import { COLORS, FONTS, ICON_SIZES, SPACING } from "../../../theme";

interface Props {
  icon?: keyof typeof MaterialIcons.glyphMap;
  children: React.ReactNode;
}

export function SectionTitle({ icon, children }: Props) {
  if (!icon) return <Text style={styles.title}>{children}</Text>;
  return (
    <View style={styles.row}>
      <MaterialIcons name={icon} size={ICON_SIZES.sm} color={COLORS.primary} />
      <Text style={[styles.title, styles.titleInRow]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  title: {
    fontSize: FONTS.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  titleInRow: { marginTop: 0, marginBottom: 0 },
});
