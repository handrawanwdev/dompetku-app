import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRealm } from '@realm/react';
import dayjs from 'dayjs';
import { create } from 'zustand';

import { COLORS, ICON_SIZES, SPACING } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { getBirthdayCelebration } from '../../utils/birthday';
import { buildBirthdayRecap } from './birthdayRecap';
import { GiftBox } from './components/GiftBox';
import { Cake } from './components/Cake';
import { Confetti } from './components/Confetti';
import { BirthdayLetter } from './components/BirthdayLetter';
import { FestiveHeading, FestiveHint, FestiveKicker } from './components/FestiveLabels';

const GIFT_HINTS = [
  'Ketuk kadonya, ada kejutan di dalamnya!',
  'Penasaran isinya? Ayo buka sekarang!',
  'Kadonya sudah nggak sabar dibuka!',
];
const CAKE_HINTS = [
  'Tahan kuenya, lalu tiup sekuat tenaga!',
  'Fuuuh! Tahan terus sampai lilinnya padam',
  'Harapan terbaik butuh tiupan terkuat!',
];

/** Buka ulang kejutan dari kartu ulang tahun di dashboard. */
export const useBirthdaySurprise = create<{ replay: boolean; open: () => void; close: () => void }>((set) => ({
  replay: false,
  open: () => set({ replay: true }),
  close: () => set({ replay: false }),
}));

type Stage = 'gift' | 'cake' | 'letter';

/**
 * Kejutan ulang tahun layar penuh: buka kado → tiup lilin → ucapan + rekap
 * setahun. Muncul sekali tiap ulang tahun saat app dibuka (sampai H+3 kalau
 * belum sempat), setelah kunci app terbuka. Bisa diputar ulang dari dashboard.
 */
export function BirthdaySurprise({ enabled }: { enabled: boolean }) {
  const realm = useRealm();
  const { settings, updateSettings } = useSettingsStore();
  const replay = useBirthdaySurprise((s) => s.replay);
  const closeReplay = useBirthdaySurprise((s) => s.close);
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();

  const celebration = getBirthdayCelebration(settings.birthday);
  const due = Boolean(celebration && settings.birthdaySurpriseSeenYear !== celebration.year);
  const visible = enabled && Boolean(celebration) && (due || replay);

  const [stage, setStage] = useState<Stage>('gift');
  const [burst, setBurst] = useState(0);

  const recap = useMemo(
    () => (visible && celebration ? buildBirthdayRecap(realm, celebration.since, dayjs().format('YYYY-MM-DD')) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, celebration?.since, realm],
  );

  if (!celebration || !recap) return null;

  const name = settings.displayName?.trim();
  const close = () => {
    if (settings.birthdaySurpriseSeenYear !== celebration.year) {
      updateSettings({ birthdaySurpriseSeenYear: celebration.year });
    }
    closeReplay();
    // Dibuka lagi nanti mulai dari kado.
    setStage('gift');
    setBurst(0);
  };
  const celebrate = () => !reduceMotion && setBurst((b) => b + 1);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={close}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.fill}>
        <SafeAreaView style={styles.fill}>
          <View style={styles.top}>
            <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Tutup kejutan">
              <MaterialIcons name="close" size={ICON_SIZES.lg} color={COLORS.heroMuted} />
            </Pressable>
          </View>

          {stage === 'gift' && (
            <Animated.View key="gift" exiting={FadeOut.duration(250)} style={styles.stage}>
              <FestiveKicker
                text={celebration.daysLate > 0 ? 'Pestanya masih berlanjut' : 'Hari spesialmu telah tiba'}
                reduceMotion={reduceMotion}
              />
              <FestiveHeading>Surprise! Ada kado spesial buat kamu{name ? `, ${name}` : ''}!</FestiveHeading>
              <View style={styles.art}>
                <GiftBox
                  reduceMotion={reduceMotion}
                  onOpened={() => {
                    celebrate();
                    setStage('cake');
                  }}
                />
              </View>
              <FestiveHint icon="touch-app" messages={GIFT_HINTS} reduceMotion={reduceMotion} />
            </Animated.View>
          )}

          {stage === 'cake' && (
            <Animated.View key="cake" entering={FadeIn.duration(400)} exiting={FadeOut.duration(250)} style={styles.stage}>
              <FestiveKicker text="Saatnya make a wish" reduceMotion={reduceMotion} />
              <FestiveHeading>Pejamkan mata, ucapkan harapan terbaikmu, lalu tiup lilinnya!</FestiveHeading>
              <View style={styles.art}>
                <Cake
                  age={celebration.age}
                  reduceMotion={reduceMotion}
                  onBlown={() => {
                    celebrate();
                    setStage('letter');
                  }}
                />
              </View>
              <FestiveHint icon="air" messages={CAKE_HINTS} reduceMotion={reduceMotion} />
            </Animated.View>
          )}

          {stage === 'letter' && (
            <Animated.View key="letter" entering={FadeIn.duration(400)} style={styles.fill}>
              <BirthdayLetter celebration={celebration} name={name} recap={recap} onClose={close} />
            </Animated.View>
          )}
        </SafeAreaView>
        <Confetti burstKey={burst} originY={height * 0.42} />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl },
  art: { height: 290, alignItems: 'center', justifyContent: 'center' },
});
