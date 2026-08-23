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
      <div className="rounded-xl bg-[#252736] p-3 shadow-2xl shadow-black/80 text-xs space-y-1">
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
    <div className="bg-[#15161f] p-5 rounded-2xl flex flex-col space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Sprint Velocity</h3>
          <p className="text-xs text-slate-400">Planned vs completed tasks per sprint cycle</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232733" vertical={false} />
            <XAxis
              dataKey="sprintName"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
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
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)', rx: 8, ry: 8 }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              formatter={(value) => <span className="text-slate-300 font-medium ml-1">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="totalTasks"
              name="Planned Tasks"
              fill="#64748b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completedTasks"
              name="Completed Tasks"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
