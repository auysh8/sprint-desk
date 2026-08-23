import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { StatusDistributionData } from '../../types/analytics';

export interface StatusDistributionChartProps {
  data: StatusDistributionData[];
  totalTasks: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as StatusDistributionData;
    return (
      <div className="rounded-xl border border-white/10 bg-[#12141c] p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-white flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.status}
        </p>
        <p className="text-slate-300">
          Tasks: <span className="font-semibold text-white">{item.count}</span> ({item.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  totalTasks,
}) => {
  return (
    <div className="card-surface p-5 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Status Distribution</h3>
          <p className="text-xs text-slate-400">Current workflow breakdown</p>
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#12141a" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white">{totalTasks}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Tasks</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-[#161822]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.status}</span>
            </div>
            <span className="font-semibold text-slate-200">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
