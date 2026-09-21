import React, { useMemo, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, StatusBar, Modal, ListRenderItemInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@realm/react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { COLORS, FONTS, SPACING, RADIUS } from "../../../theme";
import { Card, Text, EmptyState, BackButton, FAB } from "../../../components/common";
import { SavingHistoryModel } from "../../../models/SavingHistoryModel";
import { SavingModel } from "../../../models/SavingModel";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { CashflowStackParamList } from "../types";

type NavProp = NativeStackNavigationProp<CashflowStackParamList>;

const TYPE_LABEL: Record<string, string> = {
  deposit: "⬆️ Setor",
  withdraw: "⬇️ Tarik",
  transfer: "🔁 Transfer",
};

function TransferItem({ item, savingName }: { item: SavingHistoryModel; savingName: string }) {
  return (
    <Card style={styles.itemCard}>
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{TYPE_LABEL[item.type] ?? item.type}</Text>
          <Text style={styles.itemSaving}>{savingName}</Text>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          {item.note ? <Text style={styles.itemNote} numberOfLines={1}>{item.note}</Text> : null}
        </View>
        <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
      </View>
    </Card>
  );
}

export function TransferScreen() {
  const navigation = useNavigation<NavProp>();
  const history = useQuery(SavingHistoryModel).sorted("date", true);
  const savings = useQuery(SavingModel);
  const [pickerVisible, setPickerVisible] = useState(false);

  const savingNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of savings) map.set(s._id.toHexString(), `${s.emoji} ${s.name}`);
    return map;
  }, [savings]);

  const openSavingDetail = (id: string) => {
    setPickerVisible(false);
    navigation.getParent()?.navigate(
      "Finance" as never,
      { screen: "SavingsTab", params: { screen: "SavingsDetail", params: { id } } } as never,
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<SavingHistoryModel>) => (
    <TransferItem item={item} savingName={savingNameMap.get(item.savingId) ?? "Tabungan"} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>🔁 Transfer</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={history as unknown as SavingHistoryModel[]}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toHexString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState emoji="🔁" title="Belum ada transfer" subtitle="Setor, tarik, atau pindah dana antar tabungan" />
        }
      />

      <FAB color={COLORS.savings} onPress={() => setPickerVisible(true)} />

      <Modal visible={pickerVisible} animationType="slide" transparent onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Pilih Tabungan</Text>
            <FlatList
              data={[...savings]}
              keyExtractor={(item) => item._id.toHexString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerRow}
                  onPress={() => openSavingDetail(item._id.toHexString())}
                  activeOpacity={0.7}
                >
                  <Text style={styles.pickerLabel}>{item.emoji} {item.name}</Text>
                  <Text style={styles.pickerBalance}>{formatCurrency(item.balance)}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <EmptyState emoji="🏦" title="Belum ada tabungan" subtitle="Buat pos tabungan dulu di menu Finance" />
              }
            />
            <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  itemCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemType: { fontSize: FONTS.sm, fontWeight: "700", color: COLORS.text },
  itemSaving: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  itemDate: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  itemNote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  itemAmount: { fontSize: FONTS.md, fontWeight: "700", color: COLORS.savings, marginLeft: SPACING.sm },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.md },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerLabel: { fontSize: FONTS.md, fontWeight: "600", color: COLORS.text },
  pickerBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  modalCancel: { marginTop: SPACING.md, alignItems: "center", paddingVertical: SPACING.sm },
  modalCancelText: { fontSize: FONTS.md, color: COLORS.danger, fontWeight: "600" },
});
