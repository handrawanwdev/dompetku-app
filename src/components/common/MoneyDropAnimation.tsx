import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { formatCurrency } from '../../utils/currency';

export type MoneyDropMode = 'in' | 'out' | 'across';

// 3 coins, staggered — last one lands/leaves ~ COIN_MOVE_MS after its own delay starts.
const COIN_MOVE_MS = 480;
const COINS = [
  { delay: 0, offset: -16 },
  { delay: 160, offset: 0 },
  { delay: 320, offset: 16 },
];
const LAST_COIN_MOVES_MS = COINS[COINS.length - 1].delay + COIN_MOVE_MS;
const AUTO_DISMISS_MS = LAST_COIN_MOVES_MS + 900;

const TARGET_OFFSET = 40; // distance from stage center to each target's center, 'across' mode only

interface Props {
  visible: boolean;
  amount: number;
  title: string;
  accentColor: string;
  icon: string;
  mode: MoneyDropMode;
  onFinish: () => void;
}

/**
 * Generic coins-in-motion celebration: coins drop into `icon` (mode 'in'),
 * fly out of it (mode 'out'), or hop from a source to a target copy of it
 * (mode 'across'). Used for both saving moves and debt/bill payments so the
 * same feel shows up everywhere money visibly moves. Auto-dismisses.
 */
export function MoneyDropAnimation({ visible, amount, title, accentColor, icon, mode, onFinish }: Props) {
  const isOut = mode === 'out';
  const isAcross = mode === 'across';

  const targetScale = useSharedValue(1); // the receiving target (only target for 'in'/'out', target for 'across')
  const sourceScale = useSharedValue(1); // source target — 'across' only
  const checkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    targetScale.value = 1;
    sourceScale.value = 1;
    checkScale.value = 0;
    textOpacity.value = 0;

    if (isOut) {
      // Target wobbles right away as coins are pulled out of it.
      targetScale.value = withSequence(
        withTiming(0.9, { duration: 120, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 6 }),
      );
    } else if (isAcross) {
      // Source wobbles as coins leave, target bounces once they arrive.
      sourceScale.value = withSequence(
        withTiming(0.9, { duration: 120, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 6 }),
      );
      targetScale.value = withDelay(
        LAST_COIN_MOVES_MS,
        withSequence(
          withTiming(1.18, { duration: 140, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 6 }),
        ),
      );
    } else {
      // Target bounces once the last coin has landed inside it.
      targetScale.value = withDelay(
        LAST_COIN_MOVES_MS,
        withSequence(
          withTiming(1.18, { duration: 140, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 6 }),
        ),
      );
    }
    checkScale.value = withDelay(LAST_COIN_MOVES_MS + 120, withSpring(1, { damping: 9 }));
    textOpacity.value = withDelay(LAST_COIN_MOVES_MS + 160, withTiming(1, { duration: 300 }));

    const timer = setTimeout(() => runOnJS(onFinish)(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, mode]);

  const targetStyle = useAnimatedStyle(() => ({ transform: [{ scale: targetScale.value }] }));
  const sourceStyle = useAnimatedStyle(() => ({ transform: [{ scale: sourceScale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: (1 - textOpacity.value) * 8 }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.stage, isAcross && styles.stageAcross]}>
            {isAcross && (
              <Animated.View
                style={[styles.targetSmall, styles.targetSource, sourceStyle, { backgroundColor: accentColor + '20' }]}
              >
                <Text style={styles.iconSmall}>{icon}</Text>
              </Animated.View>
            )}

            {COINS.map((coin, i) => (
              <Coin key={i} delay={coin.delay} offset={coin.offset} trigger={visible} mode={mode} />
            ))}

            <Animated.View
              style={[
                isAcross ? styles.targetSmall : styles.target,
                isAcross && styles.targetDestination,
                targetStyle,
                { backgroundColor: accentColor + '20' },
              ]}
            >
              <Text style={isAcross ? styles.iconSmall : styles.iconLarge}>{icon}</Text>
            </Animated.View>

            <Animated.View style={[styles.checkBadge, isAcross && styles.checkBadgeAcross, checkStyle]}>
              <MaterialIcons name="check" size={16} color="#ffffff" />
            </Animated.View>
          </View>
          <Animated.View style={textStyle}>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.amount, { color: accentColor }]}>{formatCurrency(amount)}</Text>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

function Coin({
  delay,
  offset,
  trigger,
  mode,
}: {
  delay: number;
  offset: number;
  trigger: boolean;
  mode: MoneyDropMode;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!trigger) return;
    progress.value = 0;
    progress.value = withDelay(delay, withTiming(1, { duration: COIN_MOVE_MS, easing: Easing.in(Easing.quad) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;

    if (mode === 'out') {
      // Rises up out of the target, fading in as it leaves and out once clear.
      const y = -p * 52;
      const opacity = p < 0.15 ? p / 0.15 : p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1;
      const scale = p < 0.15 ? 0.6 + (p / 0.15) * 0.4 : 1;
      return {
        opacity,
        transform: [{ translateX: offset }, { translateY: y }, { rotate: `${-p * 200}deg` }, { scale }],
      };
    }

    if (mode === 'across') {
      // Hops from the source to the target in a small arc. Baseline 49 lines
      // the coin up with the small targets' vertical center; the sine term
      // lifts it into a hop at the midpoint of the flight.
      const x = -TARGET_OFFSET + p * (TARGET_OFFSET * 2);
      const y = 49 - 30 * Math.sin(p * Math.PI) + offset * 0.15;
      const opacity = p < 0.12 ? p / 0.12 : p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1;
      const scale = p < 0.12 ? 0.7 + (p / 0.12) * 0.3 : p > 0.85 ? 1 - ((p - 0.85) / 0.15) * 0.4 : 1;
      return {
        opacity,
        transform: [{ translateX: x }, { translateY: y }, { rotate: `${p * 360}deg` }, { scale }],
      };
    }

    // 'in' — falls from above the lid down into the target, fading out as it disappears inside.
    const y = -52 + p * 52;
    const opacity = p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
    const scale = p < 0.7 ? 1 : 1 - ((p - 0.7) / 0.3) * 0.5;
    return {
      opacity,
      transform: [{ translateX: offset }, { translateY: y }, { rotate: `${p * 200}deg` }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.coin, style]}>
      <Text style={styles.coinText}>Rp</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xxxl,
    alignItems: 'center',
    minWidth: 220,
  },
  stage: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: SPACING.lg,
  },
  stageAcross: {
    width: 150,
  },
  target: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLarge: { fontSize: 36 },
  targetSmall: {
    position: 'absolute',
    bottom: 12,
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetSource: { left: 4 },
  targetDestination: { right: 4 },
  iconSmall: { fontSize: 28 },
  checkBadge: {
    position: 'absolute',
    right: 6,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.income,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  checkBadgeAcross: { right: 0, bottom: 8 },
  coin: {
    position: 'absolute',
    top: 0,
    width: 22,
    height: 22,
    borderRadius: RADIUS.round,
    backgroundColor: '#fbbf24',
    borderWidth: 1.5,
    borderColor: '#d97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: { fontSize: 8, fontWeight: '700', color: '#92400e' },
  title: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  amount: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
