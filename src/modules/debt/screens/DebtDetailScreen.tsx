import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm, useQuery } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Realm from 'realm';

import { COLORS, FONTS, SPACING, RADIUS } from '../../../theme';
import { Card, Text, Button, Input, DateInput, CurrencyInput, AmountDisplay, ProgressBar, EmptyState, BackButton } from '../../../components/common';
import { DebtModel } from '../../../models/DebtModel';
import { DebtPaymentModel } from '../../../models/DebtPaymentModel';
import { SavingModel } from '../../../models/SavingModel';
import { getKasBebasBalance, applyDebtPaymentFunding } from '../../../services/AllocationService';
import { formatCurrency } from '../../../utils/currency';
import { formatDate, today, isOverdue } from '../../../utils/date';
import type { DebtStackParamList } from './DebtListScreen';

// ─── Constants ────────────────────────────────────────────────────────────────

const FUNDING_SOURCES = [
  { value: 'cash', label: 'Kas Bebas', color: COLORS.warning },
  { value: 'savings', label: 'Tabungan', color: COLORS.savings },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type NavProp = NativeStackNavigationProp<DebtStackParamList, 'DebtDetail'>;
type RouteType = RouteProp<DebtStackParamList, 'DebtDetail'>;

// ─── Payment Item ─────────────────────────────────────────────────────────────

interface PaymentItemProps {
  item: DebtPaymentModel;
}

function PaymentItem({ item }: PaymentItemProps) {
  return (
    <View style={styles.paymentItem}>
      <View style={styles.paymentLeft}>
        <View style={styles.paymentIcon}>
          <Text style={styles.paymentIconText}>💳</Text>
        </View>
        <View>
          <Text style={styles.paymentDate}>{formatDate(item.date)}</Text>
          {item.note ? (
            <Text style={styles.paymentNote} numberOfLines={1}>
              {item.note}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.paymentAmount}>- {formatCurrency(item.amount)}</Text>
    </View>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────

interface PaymentModalProps {
  visible: boolean;
  defaultAmount: number;
  savings: Realm.Results<SavingModel>;
  kasBebasBalance: number;
  onClose: () => void;
  onConfirm: (amount: number, date: string, note: string, source: string, savingId: string) => void;
}

function PaymentModal({ visible, defaultAmount, savings, kasBebasBalance, onClose, onConfirm }: PaymentModalProps) {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [source, setSource] = useState('cash');
  const [savingId, setSavingId] = useState('');
  const [showSavingPicker, setShowSavingPicker] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [sourceError, setSourceError] = useState('');

  const selectedSaving = savings.find((s) => s._id.toHexString() === savingId);

  const resetFields = () => {
    setAmount(defaultAmount.toString());
    setDate(today());
    setNote('');
    setSource('cash');
    setSavingId('');
    setAmountError('');
    setSourceError('');
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleConfirm = () => {
    const parsed = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!parsed || parsed <= 0) {
      setAmountError('Nominal harus lebih dari 0');
      return;
    }
    setAmountError('');
    if (source === 'cash' && parsed > kasBebasBalance) {
      setSourceError('Kas Bebas tidak mencukupi');
      return;
    }
    if (source === 'savings') {
      if (!savingId) {
        setSourceError('Pilih pos tabungan sumber dana');
        return;
      }
      if (!selectedSaving || selectedSaving.balance < parsed) {
        setSourceError('Saldo tabungan tidak mencukupi');
        return;
      }
    }
    setSourceError('');
    onConfirm(parsed, date, note, source, savingId);
    resetFields();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.modalBackdrop} onPress={handleClose} activeOpacity={1} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Bayar Cicilan</Text>

          <CurrencyInput
            label="Nominal Pembayaran"
            value={amount}
            onChangeText={(v) => {
              setAmount(v);
              setAmountError('');
            }}
            error={amountError}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Sumber Dana</Text>
            <View style={styles.sourceRow}>
              {FUNDING_SOURCES.map((src) => {
                const isSelected = source === src.value;
                return (
                  <TouchableOpacity
                    key={src.value}
                    onPress={() => {
                      setSource(src.value);
                      setSourceError('');
                    }}
                    style={[
                      styles.sourceOption,
                      isSelected && { borderColor: src.color, backgroundColor: src.color + '22' },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && { borderColor: src.color, backgroundColor: src.color },
                      ]}
                    />
                    <Text style={[styles.sourceLabel, isSelected ? { color: src.color } : null]}>
                      {src.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {source === 'cash' && (
              <Text style={styles.sourceHint}>Saldo Kas Bebas: {formatCurrency(kasBebasBalance)}</Text>
            )}
            {source === 'savings' && (
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowSavingPicker(true)}>
                <Text style={selectedSaving ? styles.pickerValue : styles.pickerPlaceholder}>
                  {selectedSaving ? `${selectedSaving.emoji} ${selectedSaving.name} — ${formatCurrency(selectedSaving.balance)}` : 'Pilih pos tabungan...'}
                </Text>
                <Text style={styles.pickerArrow}>›</Text>
              </TouchableOpacity>
            )}
            {sourceError ? <Text style={styles.errorText}>{sourceError}</Text> : null}
          </View>

          <DateInput
            label="Tanggal Pembayaran"
            value={date}
            onChange={setDate}
          />

          <Input
            label="Catatan (opsional)"
            placeholder="Tambah catatan..."
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.modalActions}>
            <Button
              title="Batal"
              onPress={handleClose}
              variant="secondary"
              style={styles.modalBtnHalf}
            />
            <Button
              title="Konfirmasi"
              onPress={handleConfirm}
              style={styles.modalBtnHalf}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Saving Picker Modal */}
      <Modal visible={showSavingPicker} transparent animationType="slide">
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.modalTitle}>Pilih Pos Tabungan</Text>
            {savings.length === 0 ? (
              <Text style={styles.emptyPickerText}>Belum ada tabungan. Buat tabungan terlebih dahulu.</Text>
            ) : (
              savings.map((s) => (
                <TouchableOpacity
                  key={s._id.toHexString()}
                  style={[styles.pickerItem, s._id.toHexString() === savingId && styles.pickerItemActive]}
                  onPress={() => {
                    setSavingId(s._id.toHexString());
                    setSourceError('');
                    setShowSavingPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{s.emoji} {s.name}</Text>
                  <Text style={styles.pickerItemBalance}>{formatCurrency(s.balance)}</Text>
                </TouchableOpacity>
              ))
            )}
            <Button title="Tutup" onPress={() => setShowSavingPicker(false)} variant="ghost" style={{ marginTop: SPACING.lg }} />
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DebtDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const realm = useRealm();
  const { id } = route.params;
  const [payModalVisible, setPayModalVisible] = useState(false);

  const allDebts = useQuery(DebtModel);
  const debt = useMemo(
    () => allDebts.find((d) => d._id.toHexString() === id) ?? null,
    [allDebts, id],
  );

  const allPayments = useQuery(DebtPaymentModel);
  const payments = useMemo(() => {
    return allPayments.filtered('debtId == $0', id).sorted('date', true);
  }, [allPayments, id]);

  const remaining = useMemo(
    () => (debt ? debt.monthlyInstallment * debt.remainingMonth : 0),
    [debt],
  );

  const progress = useMemo(() => {
    if (!debt || debt.totalAmount <= 0) return 0;
    const paid = debt.totalAmount - remaining;
    return Math.min((paid / debt.totalAmount) * 100, 100);
  }, [debt, remaining]);

  const overdue = debt ? isOverdue(debt.dueDate) && debt.remainingMonth > 0 : false;

  const savings = useQuery(SavingModel);
  const kasBebasBalance = getKasBebasBalance(realm);

  const handlePayment = useCallback(
    (amount: number, date: string, note: string, source: string, savingId: string) => {
      if (!debt) return;
      try {
        realm.write(() => {
          const funding = applyDebtPaymentFunding(realm, {
            source,
            savingId,
            amount,
            lender: debt.lender,
            date,
          });
          if (!funding.ok) throw new Error(funding.error);

          realm.create(DebtPaymentModel, {
            _id: new Realm.BSON.ObjectId(),
            debtId: id,
            amount,
            date,
            note,
            source,
            savingId: source === 'savings' ? savingId : '',
            createdAt: new Date(),
          });
          const newRemaining = Math.max(0, debt.remainingMonth - 1);
          debt.remainingMonth = newRemaining;
          if (newRemaining === 0) {
            debt.isActive = false;
          }
        });
        setPayModalVisible(false);
      } catch (e) {
        Alert.alert('Validasi', e instanceof Error ? e.message : 'Gagal memproses pembayaran');
      }
    },
    [debt, id, realm],
  );

  const renderPayment = useCallback(
    ({ item }: ListRenderItemInfo<DebtPaymentModel>) => <PaymentItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: DebtPaymentModel) => item._id.toHexString(), []);

  if (!debt) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.scroll}>
          <EmptyState emoji="🔍" title="Data tidak ditemukan" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <TouchableOpacity
          onPress={() => navigation.navigate('DebtForm', { id })}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.lenderLabel}>Kreditur</Text>
              <Text style={styles.lenderName}>{debt.lender}</Text>
            </View>
            <View style={[styles.statusBadge, overdue ? styles.statusOverdue : styles.statusLancar]}>
              <Text style={[styles.statusText, overdue ? styles.statusTextOverdue : styles.statusTextLancar]}>
                {overdue ? 'JATUH TEMPO' : 'LANCAR'}
              </Text>
            </View>
          </View>

          <Text style={styles.remainingLabel}>Sisa Hutang</Text>
          <AmountDisplay amount={remaining} size="xl" style={{ color: COLORS.debt }} />

          <ProgressBar
            progress={progress}
            color={overdue ? COLORS.danger : COLORS.debt}
            height={8}
            style={styles.progressBar}
          />

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>
              Lunas {formatCurrency(debt.totalAmount - remaining)}
            </Text>
            <Text style={styles.progressLabelText}>
              {progress.toFixed(0)}%
            </Text>
            <Text style={styles.progressLabelText}>
              Total {formatCurrency(debt.totalAmount)}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cicilan/Bulan</Text>
              <Text style={styles.statValue}>{formatCurrency(debt.monthlyInstallment)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sisa Bulan</Text>
              <Text style={styles.statValue}>{debt.remainingMonth} bulan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Jatuh Tempo</Text>
              <Text style={[styles.statValue, overdue ? { color: COLORS.danger } : null]}>
                Tgl {debt.dueDate}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Mulai</Text>
              <Text style={styles.statValue}>{formatDate(debt.startDate, 'MMM YYYY')}</Text>
            </View>
          </View>

          {debt.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Catatan</Text>
              <Text style={styles.noteText}>{debt.note}</Text>
            </View>
          ) : null}
        </Card>

        {/* Payment CTA */}
        {debt.remainingMonth > 0 && (
          <Button
            title={`💳  Bayar Cicilan  •  ${formatCurrency(debt.monthlyInstallment)}`}
            onPress={() => setPayModalVisible(true)}
            fullWidth
            style={styles.payBtn}
          />
        )}

        {/* Payment History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Pembayaran</Text>
          <Text style={styles.historyCount}>{payments.length} pembayaran</Text>
        </View>

        <FlatList
          data={payments as unknown as DebtPaymentModel[]}
          renderItem={renderPayment}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyPayments}>
              <Text style={styles.emptyPaymentsText}>Belum ada riwayat pembayaran</Text>
            </View>
          }
        />
      </ScrollView>

      <PaymentModal
        visible={payModalVisible}
        defaultAmount={debt.monthlyInstallment}
        savings={savings}
        kasBebasBalance={kasBebasBalance}
        onClose={() => setPayModalVisible(false)}
        onConfirm={handlePayment}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  editBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  summaryCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  lenderLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lenderName: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusLancar: {
    backgroundColor: COLORS.success + '22',
  },
  statusOverdue: {
    backgroundColor: COLORS.danger + '22',
  },
  statusText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextLancar: {
    color: COLORS.success,
  },
  statusTextOverdue: {
    color: COLORS.danger,
  },
  remainingLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  progressLabelText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  statItem: {
    width: '50%',
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  statLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  noteContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  noteLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noteText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  payBtn: {
    marginBottom: SPACING.lg,
  },
  historySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  historyTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyCount: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentDate: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  paymentNote: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.debt,
    marginLeft: SPACING.sm,
  },
  emptyPayments: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyPaymentsText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  modalBtnHalf: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  sourceRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  sourceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  sourceLabel: {
    fontSize: FONTS.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  sourceHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  errorText: {
    fontSize: FONTS.sm,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  pickerValue: { flex: 1, fontSize: FONTS.md, color: COLORS.text },
  pickerPlaceholder: { flex: 1, fontSize: FONTS.md, color: COLORS.textMuted },
  pickerArrow: { fontSize: FONTS.lg, color: COLORS.textMuted },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  pickerModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '70%',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '11' },
  pickerItemText: { fontSize: FONTS.md, color: COLORS.text },
  pickerItemBalance: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  emptyPickerText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
