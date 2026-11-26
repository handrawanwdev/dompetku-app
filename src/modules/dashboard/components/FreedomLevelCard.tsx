import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, ProgressBar, Text } from '../../../components/common';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';
import { useRootNavigation } from '../../../navigation/types';
import { useFreedomLevel } from '../../freedom/useFreedomLevel';

/** Level sekarang + satu langkah berikutnya. Ketuk = halaman detail. */
export function FreedomLevelCard() {
  const nav = useRootNavigation();
  const f = useFreedomLevel();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => nav.navigate('FreedomLevel')}
      accessibilityRole="button"
      accessibilityLabel={`Level keuangan ${f.level} dari 7, ${f.current.name}`}
    >
      <Card style={styles.card} padding={SPACING.lg}>
        <View style={styles.head}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{f.level}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.caption}>Level keuangan</Text>
            <Text style={styles.title}>{f.current.name}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={ICON_SIZES.md} color={COLORS.textMuted} />
        </View>
        {f.next && (
          <>
            <ProgressBar progress={f.nextProgress * 100} color={COLORS.primary} height={6} style={styles.bar} />
            <Text style={styles.step} numberOfLines={2}>
              <Text style={styles.stepLead}>Ke {f.next.name}: </Text>
              {f.nextStep}
            </Text>
          </>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const BADGE = 40;

const styles = StyleSheet.create({
  card: { marginTop: SPACING.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.primary },
  caption: { fontSize: FONTS.xs, color: COLORS.textSecondary },
  title: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.text },
  bar: { marginTop: SPACING.md },
  step: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 18 },
  stepLead: { fontWeight: '700', color: COLORS.text },
});
