'use client';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { DataPoint } from '@/types';
import { formatShortDate } from '@/lib/utils/format';

interface Props {
  data: DataPoint[];
  barColor?: string;
  lineColor?: string;
  unit?: string;
  height?: number;
}

export default function BarLineChart({
  data,
  barColor = '#4f8ef7',
  lineColor = '#fbbf24',
  unit = '',
  height = 220,
}: Props) {
  const formatted = data.map((d) => ({ ...d, label: formatShortDate(d.date) }));
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formatted} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1e2230" />
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
            width={52}
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
          <Bar dataKey="value" fill={barColor} opacity={0.5} radius={[3, 3, 0, 0]} />
          <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
