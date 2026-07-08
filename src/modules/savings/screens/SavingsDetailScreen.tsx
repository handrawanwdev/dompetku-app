import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Realm from 'realm';
import { useRealm, useQuery, useObject } from '@realm/react';

import { SavingModel, SavingHistoryModel } from '../../../models';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import { formatDate, today } from '../../../utils/date';
import { calcGoalProgress } from '../../../utils/finance';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { BackButton } from '../../../components/common/BackButton';
import { DateInput } from '../../../components/common/DateInput';
import { CurrencyInput } from '../../../components/common/CurrencyInput';

import type { SavingsStackParamList } from './SavingsListScreen';

type Props = NativeStackScreenProps<SavingsStackParamList, 'SavingsDetail'>;
type ModalType = 'deposit' | 'withdraw' | 'transfer' | null;

const TYPE_LABEL: Record<string, string> = {
  deposit: 'Setor',
  withdraw: 'Tarik',
  transfer: 'Transfer',
};

const TYPE_COLOR: Record<string, string> = {
  deposit: COLORS.income,
  withdraw: COLORS.expense,
  transfer: COLORS.warning,
};

export function SavingsDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const realm = useRealm();

  // useObject gives reactive updates when saving changes
  const saving = useObject(SavingModel, new Realm.BSON.ObjectId(id));
  const history = useQuery(
    SavingHistoryModel,
    objs => objs.filtered('savingId == $0', id).sorted('date', true),
    [id],
  );
  const allSavings = useQuery(SavingModel);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [targetSavingId, setTargetSavingId] = useState<string | null>(null);
  const [showSavingPicker, setShowSavingPicker] = useState(false);

  if (!saving) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
        </View>
        <EmptyState emoji="🏦" title="Tabungan tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const progress = calcGoalProgress(saving.balance, saving.target);
  const remaining = Math.max(saving.target - saving.balance, 0);
  const otherSavings = [...allSavings].filter(s => s._id.toHexString() !== id);
  const selectedTarget = otherSavings.find(s => s._id.toHexString() === targetSavingId);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setAmount('');
    setDate(today());
    setNote('');
    setTargetSavingId(null);
    setShowSavingPicker(false);
  };

  const closeModal = () => {
    setModalType(null);
    setShowSavingPicker(false);
  };

  const handleConfirm = () => {
    const amt = parseCurrency(amount);
    if (!amt || amt <= 0) {
      Alert.alert('Validasi', 'Jumlah harus lebih dari 0');
      return;
    }
    if (!date) {
      Alert.alert('Validasi', 'Tanggal harus diisi');
      return;
    }
    if (modalType === 'withdraw' && amt > saving.balance) {
      Alert.alert('Validasi', 'Saldo tidak mencukupi');
      return;
    }
    if (modalType === 'transfer') {
      if (!targetSavingId) {
        Alert.alert('Validasi', 'Pilih tabungan tujuan terlebih dahulu');
        return;
      }
      if (amt > saving.balance) {
        Alert.alert('Validasi', 'Saldo tidak mencukupi untuk transfer');
        return;
      }
    }

    try {
      realm.write(() => {
        if (modalType === 'deposit') {
          saving.balance += amt;
          realm.create(SavingHistoryModel, {
            _id: new Realm.BSON.ObjectId(),
            savingId: id,
            type: 'deposit',
            amount: amt,
            date,
            note: note.trim(),
            createdAt: new Date(),
          });
        } else if (modalType === 'withdraw') {
          saving.balance -= amt;
          realm.create(SavingHistoryModel, {
            _id: new Realm.BSON.ObjectId(),
            savingId: id,
            type: 'withdraw',
            amount: amt,
            date,
            note: note.trim(),
            createdAt: new Date(),
          });
        } else if (modalType === 'transfer' && targetSavingId) {
          const target = realm.objectForPrimaryKey(
            SavingModel,
            new Realm.BSON.ObjectId(targetSavingId),
          );
          if (!target) return;

          saving.balance -= amt;
          realm.create(SavingHistoryModel, {
            _id: new Realm.BSON.ObjectId(),
            savingId: id,
            type: 'transfer',
            amount: amt,
            date,
            note: `→ ${target.name}${note ? ': ' + note : ''}`,
            createdAt: new Date(),
          });

          target.balance += amt;
          realm.create(SavingHistoryModel, {
            _id: new Realm.BSON.ObjectId(),
            savingId: targetSavingId,
            type: 'transfer',
            amount: amt,
            date,
            note: `← ${saving.name}${note ? ': ' + note : ''}`,
            createdAt: new Date(),
          });
        }
      });
      closeModal();
    } catch {
      Alert.alert('Error', 'Gagal menyimpan transaksi');
    }
  };

  const modalTitle =
    modalType === 'deposit'
      ? 'Setor Tabungan'
      : modalType === 'withdraw'
        ? 'Tarik Tabungan'
        : 'Transfer Tabungan';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[...history]}
        keyExtractor={item => item._id.toHexString()}
        contentContainerStyle={[styles.list, history.length === 0 && styles.listEmpty]}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <BackButton onPress={() => navigation.goBack()} color={COLORS.text} />
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('SavingsForm', { id })}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>Saldo Saat Ini</Text>
                  <Text style={styles.summaryBalance}>{formatCurrency(saving.balance)}</Text>
                </View>
                <View style={styles.summaryRight}>
                  <Text style={styles.summaryLabel}>Progress</Text>
                  <Text
                    style={[styles.summaryPct, progress >= 100 && styles.summaryPctDone]}
                  >
                    {progress.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <ProgressBar
                progress={progress}
                color={progress >= 100 ? COLORS.income : COLORS.savings}
                height={8}
                style={styles.progressBar}
              />

              <View style={styles.targetRow}>
                <Text style={styles.targetLabel}>Target: {formatCurrency(saving.target)}</Text>
                {remaining > 0 && (
                  <Text style={styles.remainLabel}>Sisa: {formatCurrency(remaining)}</Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionDeposit]}
                onPress={() => openModal('deposit')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>⬆️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.income }]}>Setor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionWithdraw]}
                onPress={() => openModal('withdraw')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>⬇️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.expense }]}>Tarik</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionTransfer]}
                onPress={() => openModal('transfer')}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>↔️</Text>
                <Text style={[styles.actionLabel, { color: COLORS.warning }]}>Transfer</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="Belum ada transaksi"
            subtitle="Mulai setor untuk mencatat riwayat"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: (TYPE_COLOR[item.type] ?? COLORS.primary) + '22' },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: TYPE_COLOR[item.type] ?? COLORS.primary },
                ]}
              >
                {TYPE_LABEL[item.type] ?? item.type}
              </Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              {!!item.note && (
                <Text style={styles.historyNote} numberOfLines={1}>
                  {item.note}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.historyAmount,
                {
                  color:
                    item.type === 'deposit'
                      ? COLORS.income
                      : item.type === 'withdraw'
                        ? COLORS.expense
                        : COLORS.warning,
                },
              ]}
            >
              {item.type === 'withdraw' ? '-' : '+'}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
      />

      {/* Transaction Modal */}
      <Modal
        visible={modalType !== null}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {/* Target Saving Picker — Transfer only */}
            {modalType === 'transfer' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tabungan Tujuan</Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setShowSavingPicker(!showSavingPicker)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={selectedTarget ? styles.pickerValue : styles.pickerPlaceholder}
                  >
                    {selectedTarget
                      ? `${selectedTarget.emoji} ${selectedTarget.name}`
                      : 'Pilih tabungan tujuan...'}
                  </Text>
                  <Text style={styles.pickerArrow}>{showSavingPicker ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showSavingPicker && (
                  <View style={styles.pickerDropdown}>
                    {otherSavings.length === 0 ? (
                      <Text style={styles.pickerEmpty}>Tidak ada tabungan lain</Text>
                    ) : (
                      otherSavings.map(s => (
                        <TouchableOpacity
                          key={s._id.toHexString()}
                          style={[
                            styles.pickerItem,
                            targetSavingId === s._id.toHexString() &&
                              styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            setTargetSavingId(s._id.toHexString());
                            setShowSavingPicker(false);
                          }}
                        >
                          <Text style={styles.pickerItemText}>
                            {s.emoji} {s.name}
                          </Text>
                          <Text style={styles.pickerItemBalance}>
                            {formatCurrency(s.balance)}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Amount */}
            <CurrencyInput label="Jumlah" value={amount} onChangeText={setAmount} />

            {/* Date */}
            <DateInput label="Tanggal" value={date} onChange={setDate} />

            {/* Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Catatan (opsional)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, styles.textInputFull]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Tambah catatan..."
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                onPress={closeModal}
                variant="secondary"
                style={styles.modalBtn}
              />
              <Button title="Simpan" onPress={handleConfirm} style={styles.modalBtn} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingBottom: SPACING.xxxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  editBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  editText: { fontSize: FONTS.md, color: COLORS.primary, fontWeight: '500' },
  // Summary
  summaryCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  summaryRight: { alignItems: 'flex-end' },
  summaryLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  summaryBalance: { fontSize: FONTS.xxl, fontWeight: '700', color: COLORS.text },
  summaryPct: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.savings },
  summaryPctDone: { color: COLORS.income },
  progressBar: { marginBottom: SPACING.sm },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  targetLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  remainLabel: { fontSize: FONTS.sm, color: COLORS.warning },
  // Actions
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionDeposit: { backgroundColor: COLORS.income + '18' },
  actionWithdraw: { backgroundColor: COLORS.expense + '18' },
  actionTransfer: { backgroundColor: COLORS.warning + '18' },
  actionIcon: { fontSize: 20, marginBottom: SPACING.xs },
  actionLabel: { fontSize: FONTS.sm, fontWeight: '600' },
  historyTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  // History Item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
    minWidth: 62,
    alignItems: 'center',
  },
  typeText: { fontSize: FONTS.xs, fontWeight: '600' },
  historyInfo: { flex: 1 },
  historyDate: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  historyNote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  historyAmount: { fontSize: FONTS.md, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.border,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  inputGroup: { marginBottom: SPACING.md },
  inputLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputPrefix: {
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  textInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.md,
    color: COLORS.text,
  },
  textInputFull: { flex: 1 },
  // Picker
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  pickerValue: { fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  pickerDropdown: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  pickerEmpty: {
    padding: SPACING.md,
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemSelected: { backgroundColor: COLORS.primary + '22' },
  pickerItemText: { fontSize: FONTS.md, color: COLORS.text },
  pickerItemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  modalBtn: { flex: 1 },
});
