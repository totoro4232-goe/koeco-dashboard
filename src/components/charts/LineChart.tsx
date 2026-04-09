'use client';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ChartProps } from '@/types';
import { formatShortDate } from '@/lib/utils/format';

export default function LineChart({ data, color = '#4f8ef7', unit = '', height = 200 }: ChartProps) {
  const formatted = data.map((d) => ({ ...d, label: formatShortDate(d.date) }));
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={formatted} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1e2230" strokeDasharray="0" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#7a8099', fontSize: 10, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#7a8099', fontSize: 10, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v + unit}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1e28',
              border: '1px solid #252a38',
              borderRadius: 8,
              fontFamily: 'DM Mono',
              fontSize: 12,
            }}
            labelStyle={{ color: '#7a8099', fontSize: 11 }}
            itemStyle={{ color: '#e8eaf0' }}
            formatter={(v: number) => [v + unit, '']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
