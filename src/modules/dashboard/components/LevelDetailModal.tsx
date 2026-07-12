import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import type { FinancialLevel } from "../../../utils/financialScore";

interface ChecklistItem {
  label: string;
  done: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  level: FinancialLevel;
  checklist: ChecklistItem[];
}

export function LevelDetailModal({ visible, onClose, level, checklist }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {level.icon} Level {level.level} — {level.name}
          </Text>
          <Text style={styles.subtitle}>Progress menuju Financial Freedom</Text>

          {checklist.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text
                style={[styles.icon, { color: item.done ? COLORS.income : COLORS.textMuted }]}
              >
                {item.done ? "✓" : "○"}
              </Text>
              <Text
                style={[styles.label, item.done && { color: COLORS.text, fontWeight: "600" }]}
              >
                {item.label}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  title: { fontSize: FONTS.xl, fontWeight: "700", color: COLORS.text },
  subtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  icon: { fontSize: FONTS.lg, fontWeight: "700", width: 28 },
  label: { fontSize: FONTS.md, color: COLORS.textSecondary },
  close: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
  },
  closeText: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
});
