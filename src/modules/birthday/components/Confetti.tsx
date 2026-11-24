import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { COLORS } from '../../../theme';

const PIECES = 42;
const DURATION = 2600;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface PieceSpec {
  x: number;
  spreadX: number;
  peakY: number;
  rotate: number;
  delay: number;
  w: number;
  h: number;
  color: string;
  round: boolean;
}

function Piece({ spec, originY, height }: { spec: PieceSpec; originY: number; height: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(spec.delay, withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    // Naik cepat ke puncak, lalu jatuh pelan sampai bawah layar.
    const up = Math.min(t.value / 0.25, 1);
    const fall = Math.max((t.value - 0.25) / 0.75, 0);
    const y = originY - spec.peakY * up + (height - originY + spec.peakY) * fall * fall;
    return {
      opacity: t.value > 0.92 ? (1 - t.value) / 0.08 : 1,
      transform: [
        { translateX: spec.x + spec.spreadX * t.value },
        { translateY: y },
        { rotate: `${spec.rotate * t.value}deg` },
        { rotateX: `${spec.rotate * 1.5 * t.value}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: spec.w, height: spec.h, backgroundColor: spec.color, borderRadius: spec.round ? spec.w : 2 },
        style,
      ]}
    />
  );
}

/** Ledakan konfeti dari titik `originY`. Ganti `burstKey` untuk meledakkan lagi. */
export function Confetti({ burstKey, originY }: { burstKey: number; originY: number }) {
  const { width, height } = useWindowDimensions();
  const palette = [COLORS.primary, COLORS.secondary, COLORS.saving, COLORS.need, COLORS.want, COLORS.invest, COLORS.heroMuted];

  const specs = useMemo<PieceSpec[]>(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        x: width / 2 + rand(-30, 30),
        spreadX: rand(-width * 0.55, width * 0.55),
        peakY: rand(120, height * 0.45),
        rotate: rand(-720, 720),
        delay: rand(0, 180),
        w: rand(6, 11),
        h: rand(10, 18),
        color: palette[i % palette.length],
        round: i % 5 === 0,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burstKey, width, height],
  );

  if (burstKey === 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {specs.map((s, i) => (
        <Piece key={`${burstKey}-${i}`} spec={s} originY={originY} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', left: 0, top: 0 },
});
