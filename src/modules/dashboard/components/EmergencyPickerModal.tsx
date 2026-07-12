import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/common";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../theme";
import { formatCurrency } from "../../../utils/currency";
import type { SavingModel } from "../../../models/SavingModel";
import Realm from "realm";

interface Props {
  visible: boolean;
  onClose: () => void;
  savings: Realm.Results<SavingModel>;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function EmergencyPickerModal({
  visible,
  onClose,
  savings,
  selectedId,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Pilih Pos Dana Darurat</Text>
          <Text style={styles.subtitle}>
            Pos tabungan mana yang jadi dana darurat kamu?
          </Text>
          {savings.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada pos tabungan. Buat dulu di menu Aset.
            </Text>
          ) : (
            savings.map((s) => (
              <TouchableOpacity
                key={s._id.toHexString()}
                style={[
                  styles.item,
                  selectedId === s._id.toHexString() && styles.itemActive,
                ]}
                onPress={() => onSelect(s._id.toHexString())}
              >
                <Text style={styles.itemText}>
                  {s.emoji} {s.name}
                </Text>
                <Text style={styles.itemBalance}>{formatCurrency(s.balance)}</Text>
              </TouchableOpacity>
            ))
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
  emptyText: { fontSize: FONTS.sm, color: COLORS.primary, fontWeight: "600" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + "11" },
  itemText: { fontSize: FONTS.md, color: COLORS.text },
  itemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  close: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.subtleBg,
    borderRadius: RADIUS.md,
  },
  closeText: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
});
