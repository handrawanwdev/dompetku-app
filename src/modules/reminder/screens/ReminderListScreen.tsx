import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS } from '../../../theme';
import { Text, EmptyState, FAB, BackButton } from '../../../components/common';
import { formatCurrency } from '../../../utils/currency';
import { REPEAT_OPTIONS, type ReminderInfo } from '../../../utils/reminder';
import { markReminderDone } from '../../../services/ReminderService';
import { useRootNavigation } from '../../../navigation/types';
import type { ReminderModel } from '../../../models/ReminderModel';
import { useReminders } from '../useReminders';
import { NotifPermissionBanner } from '../NotifPermissionBanner';
import type { ReminderStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<ReminderStackParamList>;

const repeatLabel = (v: string) => REPEAT_OPTIONS.find((o) => o.value === v)?.label ?? '';

function ReminderItem({
  info,
  onPress,
  onRecord,
  onDone,
}: {
  info: ReminderInfo<ReminderModel>;
  onPress: () => void;
  onRecord: () => void;
  onDone: () => void;
}) {
  const { reminder: r, status, due } = info;
  const finished = !due;
  const sub = [
    repeatLabel(info.repeat),
    due ? (info.paidCurrent ? `berikutnya ${due.format('D MMM YYYY')}` : due.format('D MMM YYYY')) : 'Selesai',
    r.categoryName || null,
  ].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity style={[styles.item, finished && styles.itemDone]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemHead}>
        <View style={styles.itemIcon}>
          <MaterialIcons name={finished ? 'check' : 'event'} size={ICON_SIZES.md} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName} numberOfLines={1}>{r.title}</Text>
          <Text style={styles.itemSub} numberOfLines={1}>{sub}</Text>
        </View>
        {status && (
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        )}
      </View>
      <Text style={styles.itemAmount}>{r.amount > 0 ? formatCurrency(r.amount) : 'Nominal tidak tentu'}</Text>

      {!finished && !info.paidCurrent && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.action, styles.actionPrimary]} onPress={onRecord} activeOpacity={0.7}>
            <MaterialIcons name="edit-note" size={ICON_SIZES.sm} color={COLORS.onPrimary} />
            <Text style={[styles.actionText, { color: COLORS.onPrimary }]}>Catat bayar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={onDone} activeOpacity={0.7}>
            <MaterialIcons name="check" size={ICON_SIZES.sm} color={COLORS.text} />
            <Text style={styles.actionText}>Sudah bayar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function ReminderListScreen() {
  const navigation = useNavigation<NavProp>();
  const rootNav = useRootNavigation();
  const realm = useRealm();
  const reminders = useReminders();

  const active = reminders.filter((r) => r.due);
  const finished = reminders.filter((r) => !r.due);

  const open = (id: string) => navigation.navigate('ReminderForm', { id });
  const record = (r: ReminderInfo) => rootNav.navigate('ExpenseForm', { billId: r.id, billPeriod: r.duePeriod });
  const done = (r: ReminderInfo) =>
    Alert.alert(
      'Tandai sudah bayar?',
      `"${r.reminder.title}" ditandai lunas untuk ${r.due?.format(r.repeat === 'yearly' ? 'YYYY' : 'MMMM YYYY') ?? 'kali ini'}. Tidak ada catatan uang keluar yang dibuat.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Tandai', onPress: () => realm.write(() => markReminderDone(realm, r.id, r.duePeriod)) },
      ],
    );

  const renderItem = (r: ReminderInfo<ReminderModel>) => (
    <ReminderItem key={r.id} info={r} onPress={() => open(r.id)} onRecord={() => record(r)} onDone={() => done(r)} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Pengingat tagihan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <NotifPermissionBanner />
        {reminders.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="Belum ada pengingat"
            subtitle="Tambahkan tagihan seperti listrik, BPJS, langganan, atau pajak kendaraan. Kamu diingatkan 3 hari sebelum dan di hari jatuh tempo."
          />
        ) : (
          <>
            {active.map(renderItem)}
            {finished.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Selesai</Text>
                {finished.map(renderItem)}
              </>
            )}
          </>
        )}
      </ScrollView>

      <FAB color={COLORS.primary} onPress={() => navigation.navigate('ReminderForm', {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, paddingTop: 0, paddingBottom: 120 },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemDone: { opacity: 0.6 },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  itemSub: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 1 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round, maxWidth: 140 },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700' },
  itemAmount: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.sm },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.subtleBg,
  },
  actionPrimary: { backgroundColor: COLORS.primary },
  actionText: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text },
});
