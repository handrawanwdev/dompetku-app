import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, ICON_SIZES, SPACING, RADIUS, SHADOWS } from '../../../theme';
import { Text, Button } from '../../../components/common';
import { accountTypeMeta, addAdjustment } from '../../../services/AccountService';
import { formatCurrency } from '../../../utils/currency';
import { useRootNavigation } from '../../../navigation/types';
import { useAccounts } from '../useAccounts';

/** Tab Dompet: saldo total dan di kantong mana saja uangnya (BCA, Blu, GoPay, tunai…). */
export function WalletScreen() {
  const nav = useRootNavigation();
  const realm = useRealm();
  const { list, totals, unassigned } = useAccounts();
  const hasAccounts = list.length > 0;
  const showUnassigned = hasAccounts && Math.abs(unassigned) >= 1;

  const daily = list.filter((a) => !a.account.isSavings);
  const saved = list.filter((a) => a.account.isSavings);
  const sum = (xs: typeof list) => xs.reduce((s, a) => s + a.balance, 0);
  const groups = [
    { key: 'daily', title: 'Sehari-hari', icon: 'account-balance-wallet' as const, color: COLORS.primary, items: daily, total: sum(daily) + (showUnassigned ? unassigned : 0) },
    { key: 'savings', title: 'Tabungan', icon: 'lock' as const, color: COLORS.saving, items: saved, total: sum(saved) },
  ].filter((g) => g.items.length > 0 || g.key === 'savings' || showUnassigned);

  const renderPocket = (a: (typeof list)[number], i: number) => {
    const m = accountTypeMeta(a.account.type);
    const share = totals.total > 0 ? Math.max(0, a.balance) / totals.total : 0;
    return (
      <TouchableOpacity
        key={a.id}
        style={[styles.row, i > 0 && styles.rowBorder]}
        onPress={() => nav.navigate('AccountDetail', { id: a.id })}
        activeOpacity={0.7}
      >
        <View style={[styles.icon, { backgroundColor: m.color + '1A' }]}>
          <MaterialIcons name={m.icon} size={ICON_SIZES.md} color={m.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{a.account.name}</Text>
            {a.account.isMain && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Utama</Text>
              </View>
            )}
          </View>
          {a.account.subName ? (
            <Text style={styles.sub} numberOfLines={1}>{a.account.subName}</Text>
          ) : null}
          <Text style={styles.meta}>
            {m.label}
            {share > 0 ? ` · ${Math.round(share * 100)}% dari saldo` : ''}
          </Text>
        </View>
        <Text style={[styles.amount, a.balance < 0 && { color: COLORS.dangerText }]}>{formatCurrency(a.balance)}</Text>
      </TouchableOpacity>
    );
  };

  const fixUnassigned = () => {
    if (unassigned > 0) {
      Alert.alert(
        'Belum masuk kantong',
        `Ada ${formatCurrency(unassigned)} yang tercatat tapi belum jelas di kantong mana.\n\nKalau uangnya ada, buka kantongnya lalu Samakan saldo. Kalau sudah terpakai tanpa dicatat, hapus selisihnya.`,
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Sudah terpakai', style: 'destructive', onPress: () => realm.write(() => addAdjustment(realm, '', -unassigned)) },
        ],
      );
    } else {
      Alert.alert(
        'Selisih saldo',
        `Saldo di kantong ${formatCurrency(-unassigned)} lebih besar dari yang tercatat, biasanya karena ada uang keluar yang dicatat tanpa kantong.\n\nSamakan supaya saldo total ikut saldo kantong?`,
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Samakan', onPress: () => realm.write(() => addAdjustment(realm, '', -unassigned)) },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dompet</Text>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => nav.navigate('Activity')}
            hitSlop={8}
            activeOpacity={0.7}
            accessibilityLabel="Riwayat semua aktivitas"
          >
            <MaterialIcons name="history" size={ICON_SIZES.md} color={COLORS.primary} />
            <Text style={styles.historyLabel}>Riwayat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Saldo total</Text>
          <Text style={[styles.heroAmount, totals.total < 0 && { color: COLORS.dangerText }]} numberOfLines={1}>
            {formatCurrency(totals.total)}
          </Text>
          <Text style={styles.heroSub}>
            Bisa dipakai {formatCurrency(totals.spendable)} · Tabungan {formatCurrency(totals.savings)}
          </Text>
          {hasAccounts && (
            <View style={styles.actions}>
              <HeroAction icon="swap-horiz" label="Pindah saldo" onPress={() => nav.navigate('TransferForm', {})} disabled={list.length < 2} />
              <HeroAction icon="add" label="Tambah kantong" onPress={() => nav.navigate('AccountForm', {})} />
            </View>
          )}
        </View>

        {hasAccounts ? (
          <>
            {groups.map((g) => (
              <View key={g.key}>
                <View style={styles.sectionHead}>
                  <MaterialIcons name={g.icon} size={ICON_SIZES.sm} color={g.color} />
                  <Text style={styles.section}>{g.title}</Text>
                  <Text style={styles.sectionTotal}>{formatCurrency(g.total)}</Text>
                </View>
                <View style={styles.list}>
                  {g.items.map((a, i) => renderPocket(a, i))}
                  {g.key === 'daily' && showUnassigned && (
                    <TouchableOpacity style={[styles.row, g.items.length > 0 && styles.rowBorder]} onPress={fixUnassigned} activeOpacity={0.7}>
                      <View style={[styles.icon, { backgroundColor: COLORS.warningBg }]}>
                        <MaterialIcons name="help-outline" size={ICON_SIZES.md} color={COLORS.warningText} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{unassigned > 0 ? 'Belum masuk kantong' : 'Selisih saldo'}</Text>
                        <Text style={styles.meta}>Ketuk untuk merapikan</Text>
                      </View>
                      <Text style={[styles.amount, { color: COLORS.warningText }]}>{formatCurrency(unassigned)}</Text>
                    </TouchableOpacity>
                  )}
                  {g.key === 'savings' && g.items.length === 0 && (
                    <TouchableOpacity style={styles.row} onPress={() => nav.navigate('AccountForm', { savings: true })} activeOpacity={0.7}>
                      <View style={[styles.icon, { backgroundColor: COLORS.saving + '1A' }]}>
                        <MaterialIcons name="add" size={ICON_SIZES.md} color={COLORS.saving} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>Tambah kantong tabungan</Text>
                        <Text style={styles.meta}>Contoh Blu atau Jago, tempat menyimpan uang yang disisihkan</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <Text style={styles.footnote}>
              Saat Sisihkan ke Tabungan, pilih kantong tabungan supaya uangnya ikut pindah ke sana.
            </Text>
          </>
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="account-balance-wallet" size={40} color={COLORS.primary} />
            <Text style={styles.emptyTitle}>Uangmu ada di mana saja?</Text>
            <Text style={styles.emptyText}>
              Tambahkan rekening dan e-wallet kamu, misal BCA, Blu, GoPay, atau tunai. Isi saldonya sekali, selanjutnya ikut berubah tiap kamu mencatat uang masuk & keluar.
            </Text>
            <Button title="Tambah kantong pertama" onPress={() => nav.navigate('AccountForm', {})} fullWidth style={{ marginTop: SPACING.lg }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroAction({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.action, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={ICON_SIZES.md} color={COLORS.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  title: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
  },
  historyLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  hero: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.sm },
  heroLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },
  heroAmount: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  heroSub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
  },
  actionLabel: { fontSize: FONTS.sm, fontWeight: '700', color: COLORS.primary },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  section: { flex: 1, fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text },
  sectionTotal: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.textSecondary },
  list: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  icon: { width: 40, height: 40, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  name: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  badge: { backgroundColor: COLORS.primarySoft, borderRadius: RADIUS.round, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText: { fontSize: FONTS.xs, fontWeight: '700', color: COLORS.primary },
  sub: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 1 },
  meta: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  footnote: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: SPACING.md, lineHeight: 18 },
  empty: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  emptyText: { fontSize: FONTS.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
});
