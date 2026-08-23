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
      <div className="rounded-2xl bg-[#161619] p-3.5 shadow-2xl shadow-black text-xs space-y-1.5 border-0">
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-emerald-400">
          Cumulative Completed: <span className="font-bold text-white">{payload[0]?.value} tasks</span>
        </p>
      </div>
    );
  }
  return null;
};

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-[#0c0c0e] p-6 rounded-3xl flex flex-col space-y-4 shadow-xl shadow-black/80">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Completion Velocity Trend</h3>
          <p className="text-xs text-neutral-400 font-medium">Cumulative task completion over sprint timeline</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <defs>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#50c878" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#50c878" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f24" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1f1f24' }}
            />
            <YAxis
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1f1f24' }}
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
              stroke="#50c878"
              strokeWidth={3}
              fill="url(#emeraldGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
