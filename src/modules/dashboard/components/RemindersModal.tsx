import React from "react";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { RemindersSection } from "./RemindersSection";
import type { DebtModel } from "../../../models/DebtModel";
import type { ReminderStatus } from "../../../utils/finance";

type Reminder = { debt: DebtModel; status: ReminderStatus };

interface Props {
  visible: boolean;
  onClose: () => void;
  urgent: Reminder[];
  normal: Reminder[];
  paid: Reminder[];
}

export function RemindersModal({ visible, onClose, urgent, normal, paid }: Props) {
  const isEmpty = urgent.length === 0 && normal.length === 0 && paid.length === 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          {isEmpty ? (
            <Text style={styles.empty}>Belum ada pengingat pembayaran</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <RemindersSection urgent={urgent} normal={normal} paid={paid} />
            </ScrollView>
          )}

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: "85%",
  },
  empty: {
    fontSize: FONTS.md,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingVertical: SPACING.xl,
  },
  close: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
  },
  closeText: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
});
