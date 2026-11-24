import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, ICON_SIZES, RADIUS, SPACING } from '../../../theme';

type Icon = keyof typeof MaterialIcons.glyphMap;

/** Bintang kecil yang berkelip dan berputar. */
function Twinkle({ delay = 0, size = ICON_SIZES.sm, reduceMotion }: { delay?: number; size?: number; reduceMotion: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    t.value = withDelay(delay, withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }), -1, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.55 + t.value * 0.45,
    transform: [{ scale: 0.75 + t.value * 0.45 }, { rotate: `${t.value * 90}deg` }],
  }));
  return (
    <Animated.View style={style}>
      <MaterialIcons name="auto-awesome" size={size} color={COLORS.heroText} />
    </Animated.View>
  );
}

/** Label kecil di atas judul, diapit bintang berkelip. */
export function FestiveKicker({ text, reduceMotion }: { text: string; reduceMotion: boolean }) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.kickerRow}>
      <Twinkle reduceMotion={reduceMotion} />
      <Animated.Text style={styles.kicker}>{text}</Animated.Text>
      <Twinkle delay={450} reduceMotion={reduceMotion} />
    </Animated.View>
  );
}

/** Judul besar. Cukup muncul pelan; teks tidak dianimasikan bergerak supaya nyaman dibaca. */
export function FestiveHeading({ children }: { children: React.ReactNode }) {
  return (
    <Animated.Text entering={FadeIn.delay(150).duration(600)} style={styles.heading}>
      {children}
    </Animated.Text>
  );
}

/**
 * Petunjuk berbentuk pil. Teksnya diam; pesan berganti pelan dengan fade,
 * hanya ikon di kiri yang bergerak lembut menunjuk ke objek.
 */
export function FestiveHint({ icon, messages, reduceMotion }: { icon: Icon; messages: string[]; reduceMotion: boolean }) {
  const [i, setI] = useState(0);
  const nudge = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || messages.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % messages.length), 4500);
    return () => clearInterval(id);
  }, [reduceMotion, messages.length]);

  useEffect(() => {
    if (reduceMotion) return;
    // Ikon "menunjuk" ke objek tiap beberapa saat, tanpa pantulan.
    nudge.value = withRepeat(
      withSequence(
        withDelay(1400, withTiming(-1, { duration: 400, easing: Easing.inOut(Easing.sin) })),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: nudge.value * 6 }, { rotate: `${nudge.value * -12}deg` }] }));

  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.pill}>
      <Animated.View style={iconStyle}>
        <MaterialIcons name={icon} size={ICON_SIZES.md} color={COLORS.primary} />
      </Animated.View>
      <View style={styles.pillTextWrap}>
        <Animated.Text key={i} entering={FadeIn.duration(500)} style={styles.pillText}>
          {messages[i]}
        </Animated.Text>
      </View>
      <MaterialIcons name="celebration" size={ICON_SIZES.md} color={COLORS.primary} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
  },
  kicker: {
    fontSize: FONTS.sm,
    fontWeight: '800',
    color: COLORS.heroText,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  heading: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '800',
    color: COLORS.heroText,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    maxWidth: '100%',
  },
  pillTextWrap: { flexShrink: 1, minHeight: 20, justifyContent: 'center' },
  pillText: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
});
