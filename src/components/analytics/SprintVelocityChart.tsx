import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SprintVelocityData } from '../../types/analytics';

export interface SprintVelocityChartProps {
  data: SprintVelocityData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#12141c] p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-white mb-1.5">{label}</p>
        <p className="text-slate-400">
          Planned Tasks: <span className="font-semibold text-slate-200">{payload[0]?.value}</span>
        </p>
        <p className="text-purple-400">
          Completed Tasks: <span className="font-semibold text-white">{payload[1]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const SprintVelocityChart: React.FC<SprintVelocityChartProps> = ({ data }) => {
  return (
    <div className="card-surface p-5 rounded-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Sprint Velocity</h3>
          <p className="text-xs text-slate-400">Planned vs completed tasks per sprint cycle</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232733" vertical={false} />
            <XAxis
              dataKey="sprintName"
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar
              dataKey="totalTasks"
              name="Planned Tasks"
              fill="#2e3344"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completedTasks"
              name="Completed Tasks"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
