import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, FONTS, SPACING } from '../../theme';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  let offset = 0;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {segments.map((seg, i) => {
            const dashArray = (seg.value / total) * circumference;
            const dashOffset = circumference - dashArray;
            const strokeDashoffset = offset;
            offset += dashArray;

            return (
              <Circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={-strokeDashoffset}
              />
            );
          })}
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={styles.center}>
            {centerValue && <Text style={styles.centerValue}>{centerValue}</Text>}
            {centerLabel && <Text style={styles.centerLabel}>{centerLabel}</Text>}
          </View>
        )}
      </View>
      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  centerLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
  },
});
