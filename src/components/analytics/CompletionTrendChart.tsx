import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CompletionTrendData } from '../../types/analytics';

export interface CompletionTrendChartProps {
  data: CompletionTrendData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#252736] p-3 shadow-2xl shadow-black/80 text-xs space-y-1">
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-purple-400">
          Cumulative Completed: <span className="font-semibold text-white">{payload[0]?.value} tasks</span>
        </p>
      </div>
    );
  }
  return null;
};

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-[#15161f] p-5 rounded-2xl flex flex-col space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Completion Velocity Trend</h3>
          <p className="text-xs text-slate-400">Cumulative task completion over sprint timeline</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#232733" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232733' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232733' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              animationDuration={200}
              cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeCompleted"
              name="Cumulative Completed"
              stroke="#c084fc"
              strokeWidth={2.5}
              fill="url(#purpleGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
