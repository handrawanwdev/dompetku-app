import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { COLORS, FONTS } from '../../theme';

interface GroupedDataPoint {
  label: string;
  income: number;
  expense: number;
}

interface GroupedBarChartProps {
  data: GroupedDataPoint[];
  height?: number;
  incomeColor?: string;
  expenseColor?: string;
}

export function GroupedBarChart({
  data,
  height = 160,
  incomeColor = COLORS.income,
  expenseColor = COLORS.expense,
}: GroupedBarChartProps) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);
  const chartWidth = 320;
  const chartHeight = height - 36;
  const gap = chartWidth / data.length;
  const barWidth = Math.min(gap * 0.32, 14);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        <G>
          {data.map((d, i) => {
            const incH = (d.income / max) * chartHeight;
            const expH = (d.expense / max) * chartHeight;
            const cx = i * gap + gap / 2;
            return (
              <G key={i}>
                <Rect
                  x={cx - barWidth - 1}
                  y={chartHeight - incH}
                  width={barWidth}
                  height={incH}
                  rx={2}
                  fill={incomeColor}
                />
                <Rect
                  x={cx + 1}
                  y={chartHeight - expH}
                  width={barWidth}
                  height={expH}
                  rx={2}
                  fill={expenseColor}
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
  container: { alignItems: 'center' },
  labels: { flexDirection: 'row', width: 320 },
  labelItem: { alignItems: 'center' },
  labelText: { fontSize: FONTS.xs, color: COLORS.textMuted },
});
