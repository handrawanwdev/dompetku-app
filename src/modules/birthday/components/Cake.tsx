import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../theme';

/** Lama menahan sampai semua lilin padam. */
const BLOW_MS = 1300;
const CANDLES = [
  { flicker: 420, lean: 1 },
  { flicker: 360, lean: 0.8 },
  { flicker: 470, lean: 1.15 },
];

function Flame({ blow, out, flickerMs, lean, reduceMotion }: {
  blow: SharedValue<number>;
  out: SharedValue<number>;
  flickerMs: number;
  lean: number;
  reduceMotion: boolean;
}) {
  const flicker = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    flicker.value = withRepeat(withTiming(1, { duration: flickerMs, easing: Easing.inOut(Easing.sin) }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const flameStyle = useAnimatedStyle(() => {
    const b = blow.value;
    return {
      opacity: (1 - out.value) * (1 - Math.max(b - 0.75, 0) * 2.5),
      transform: [
        { translateY: 6 * b },
        { rotate: `${(flicker.value - 0.5) * 8 + b * 35 * lean}deg` },
        { scaleY: (0.92 + flicker.value * 0.16) * (1 - b * 0.6) },
        { scaleX: 1 - b * 0.3 },
      ],
    };
  });
  // Asap naik setelah api padam.
  const smokeStyle = useAnimatedStyle(() => ({
    opacity: out.value * (1 - out.value) * 2.4,
    transform: [{ translateY: -36 * out.value }, { scale: 0.6 + out.value * 1.4 }],
  }));

  return (
    <View style={styles.flameSlot}>
      <Animated.View style={[styles.smoke, smokeStyle]} />
      <Animated.View style={[styles.flame, flameStyle]}>
        <View style={styles.flameCore} />
      </Animated.View>
    </View>
  );
}

interface Props {
  age: number;
  reduceMotion: boolean;
  onBlown: () => void;
}

/** Kue dengan lilin menyala. Tahan kuenya untuk meniup; lepas terlalu cepat, apinya menyala lagi. */
export function Cake({ age, reduceMotion, onBlown }: Props) {
  const blow = useSharedValue(0);
  const out = useSharedValue(0);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    out.value = withTiming(1, { duration: 900 });
    setTimeout(onBlown, 700);
  };

  const start = () => {
    if (done.current) return;
    cancelAnimation(blow);
    blow.value = withTiming(1, { duration: BLOW_MS * (1 - blow.value), easing: Easing.in(Easing.quad) }, (ok) => {
      if (ok) runOnJS(finish)();
    });
  };
  const stop = () => {
    if (done.current) return;
    cancelAnimation(blow);
    blow.value = withDelay(80, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
  };
  const blowAll = () => {
    if (done.current) return;
    cancelAnimation(blow);
    blow.value = withTiming(1, { duration: 500 }, (ok) => {
      if (ok) runOnJS(finish)();
    });
  };

  const progressStyle = useAnimatedStyle(() => ({ width: `${Math.min(blow.value, 1) * 100}%` }));

  return (
    <View style={styles.root}>
      <Pressable
        onPressIn={start}
        onPressOut={stop}
        accessibilityRole="button"
        accessibilityLabel="Kue ulang tahun"
        accessibilityHint="Tahan untuk meniup lilin"
        onAccessibilityTap={blowAll}
      >
        <View style={styles.candles}>
          {CANDLES.map((c, i) => (
            <View key={i} style={styles.candleCol}>
              <Flame blow={blow} out={out} flickerMs={c.flicker} lean={c.lean} reduceMotion={reduceMotion} />
              <View style={styles.wick} />
              <View style={styles.candle}>
                <View style={styles.candleStripe} />
                <View style={[styles.candleStripe, { top: 22 }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.topTier}>
          <View style={styles.drips}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={[styles.drip, { height: i % 2 ? 14 : 22 }]} />
            ))}
          </View>
        </View>
        <View style={styles.bottomTier}>
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>
          {age > 0 && <Text style={styles.age}>{age}</Text>}
        </View>
        <View style={styles.plate} />
      </Pressable>

      <View style={styles.holdBar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Animated.View style={[styles.holdFill, progressStyle]} />
      </View>
      <Pressable onPress={blowAll} hitSlop={10} accessibilityRole="button">
        <Text style={styles.altText}>Mau langsung tiup? Ketuk di sini</Text>
      </Pressable>
    </View>
  );
}

const TOP_W = 150;
const BOTTOM_W = 210;

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  candles: { flexDirection: 'row', justifyContent: 'center', gap: 26, marginBottom: -2 },
  candleCol: { alignItems: 'center' },
  flameSlot: { width: 30, height: 40, alignItems: 'center', justifyContent: 'flex-end' },
  flame: {
    width: 16,
    height: 26,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  flameCore: { width: 7, height: 11, borderRadius: 4, backgroundColor: COLORS.warningBg },
  smoke: {
    position: 'absolute',
    bottom: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.heroMuted,
  },
  wick: { width: 2, height: 5, backgroundColor: COLORS.text },
  candle: {
    width: 12,
    height: 40,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  candleStripe: {
    position: 'absolute',
    top: 8,
    left: -4,
    width: 20,
    height: 6,
    backgroundColor: COLORS.secondary,
    transform: [{ rotate: '-25deg' }],
  },
  topTier: {
    alignSelf: 'center',
    width: TOP_W,
    height: 52,
    borderTopLeftRadius: RADIUS.sm,
    borderTopRightRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
    overflow: 'hidden',
  },
  drips: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, height: 10 },
  drip: { width: 14, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, backgroundColor: COLORS.surface },
  bottomTier: {
    alignSelf: 'center',
    width: BOTTOM_W,
    height: 76,
    borderTopLeftRadius: RADIUS.sm,
    borderTopRightRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: { position: 'absolute', top: 10, flexDirection: 'row', gap: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  age: { fontSize: FONTS.xxxl, fontWeight: '800', color: COLORS.onPrimary, marginTop: SPACING.md },
  plate: {
    alignSelf: 'center',
    width: BOTTOM_W + 40,
    height: 14,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    opacity: 0.9,
  },
  holdBar: {
    width: 180,
    height: 6,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primaryDark,
    marginTop: SPACING.xl,
    overflow: 'hidden',
  },
  holdFill: { height: '100%', backgroundColor: COLORS.heroText },
  altText: { fontSize: FONTS.sm, color: COLORS.heroMuted, marginTop: SPACING.md, textDecorationLine: 'underline' },
});
