import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, RADIUS } from '../../../theme';

const BOX_W = 150;
const BOX_H = 110;
const LID_W = 168;
const LID_H = 36;
const RIBBON = 24;

interface Props {
  reduceMotion: boolean;
  onOpened: () => void;
}

/** Kado bergoyang menunggu diketuk; saat diketuk tutupnya terlempar dan cahaya memancar. */
export function GiftBox({ reduceMotion, onOpened }: Props) {
  const bob = useSharedValue(0);
  const wiggle = useSharedValue(0);
  const press = useSharedValue(1);
  const lid = useSharedValue(0);
  const glow = useSharedValue(0);
  const opened = useSharedValue(false);

  useEffect(() => {
    if (reduceMotion) return;
    bob.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
    // Goyang kecil tiap beberapa detik, seperti ada sesuatu di dalamnya.
    wiggle.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(-1, { duration: 70 })),
        withTiming(1, { duration: 70 }),
        withTiming(-1, { duration: 70 }),
        withTiming(1, { duration: 70 }),
        withTiming(0, { duration: 70 }),
      ),
      -1,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const open = () => {
    if (opened.value) return;
    opened.value = true;
    wiggle.value = withTiming(0, { duration: 80 });
    press.value = withSequence(withTiming(0.88, { duration: 120 }), withSpring(1.06, { damping: 7 }));
    glow.value = withDelay(120, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    lid.value = withDelay(
      120,
      withTiming(1, { duration: reduceMotion ? 300 : 650, easing: Easing.out(Easing.cubic) }, (done) => {
        if (done) runOnJS(onOpened)();
      }),
    );
  };

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -10 * bob.value },
      { rotate: `${wiggle.value * 5}deg` },
      { scale: press.value },
    ],
  }));
  const lidStyle = useAnimatedStyle(() => ({
    opacity: 1 - lid.value,
    transform: [
      { translateY: -260 * lid.value },
      { translateX: 40 * lid.value },
      { rotate: `${-40 * lid.value}deg` },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * (1 - glow.value) * 3.2,
    transform: [{ scale: 0.4 + glow.value * 2.6 }],
  }));

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel="Kado ulang tahun"
      accessibilityHint="Ketuk untuk membuka kado"
      hitSlop={30}
    >
      <Animated.View style={[styles.wrap, wrapStyle]}>
        <Animated.View style={[styles.glow, glowStyle]} />

        <Animated.View style={[styles.lidWrap, lidStyle]}>
          <View style={styles.bow}>
            <View style={[styles.loop, styles.loopLeft]} />
            <View style={[styles.loop, styles.loopRight]} />
            <View style={styles.knot} />
          </View>
          <View style={styles.lid}>
            <View style={[styles.ribbonV, { height: LID_H }]} />
          </View>
        </Animated.View>

        <View style={styles.box}>
          <View style={[styles.ribbonV, { height: BOX_H }]} />
          <View style={styles.shade} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: LID_W, height: BOX_H + LID_H + 44, alignItems: 'center', justifyContent: 'flex-end' },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.heroMuted,
    top: 0,
  },
  lidWrap: { alignItems: 'center', zIndex: 2 },
  lid: {
    width: LID_W,
    height: LID_H,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
  },
  box: {
    width: BOX_W,
    height: BOX_H,
    marginTop: -2,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    overflow: 'hidden',
  },
  shade: { position: 'absolute', top: 0, left: 0, right: 0, height: 10, backgroundColor: COLORS.primaryDark, opacity: 0.35 },
  ribbonV: { width: RIBBON, backgroundColor: COLORS.heroMuted },
  bow: { width: 90, height: 40, marginBottom: -6, alignItems: 'center', justifyContent: 'flex-end' },
  loop: {
    position: 'absolute',
    bottom: 4,
    width: 40,
    height: 30,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: COLORS.heroMuted,
  },
  loopLeft: { left: 4, transform: [{ rotate: '-25deg' }] },
  loopRight: { right: 4, transform: [{ rotate: '25deg' }] },
  knot: { width: 20, height: 18, borderRadius: 6, backgroundColor: COLORS.heroMuted, marginBottom: 0 },
});
