import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { COLORS, FONTS, SPACING } from '../../theme';
import { formatCompact } from '../../utils/currency';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
  barColor?: string;
}

export function SimpleBarChart({ data, height = 180, barColor = COLORS.primary }: SimpleBarChartProps) {
  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.value), 1);
  const chartWidth = 300;
  const chartHeight = height - 40;
  const barWidth = Math.min((chartWidth / data.length) * 0.6, 32);
  const gap = chartWidth / data.length;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        <G>
          {data.map((d, i) => {
            const barHeight = (d.value / max) * chartHeight;
            const x = i * gap + gap / 2 - barWidth / 2;
            const y = chartHeight - barHeight;
            return (
              <G key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill={d.color || barColor}
                  opacity={0.9}
                />
              </G>
            );
          })}
        </G>
      </Svg>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <View key={i} style={[styles.labelItem, { width: chartWidth / data.length }]}>
            <Text style={styles.labelText} numberOfLines={1}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labels: {
    flexDirection: 'row',
    width: 300,
  },
  labelItem: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
});
