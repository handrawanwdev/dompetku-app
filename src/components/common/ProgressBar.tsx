import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, color = COLORS.primary, height = 8, style }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  return (
    <View style={[styles.track, { height }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: RADIUS.round,
  },
});
