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
import type { PriorityBreakdownData } from '../../types/analytics';

export interface PriorityMatrixChartProps {
  data: PriorityBreakdownData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#252736] p-3 shadow-2xl shadow-black/80 text-xs space-y-1">
        <p className="font-bold text-white mb-1.5">{label} Column</p>
        <p className="text-rose-400">
          High: <span className="font-semibold text-white">{payload[0]?.value}</span>
        </p>
        <p className="text-amber-400">
          Medium: <span className="font-semibold text-white">{payload[1]?.value}</span>
        </p>
        <p className="text-blue-400">
          Low: <span className="font-semibold text-white">{payload[2]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const PriorityMatrixChart: React.FC<PriorityMatrixChartProps> = ({ data }) => {
  return (
    <div className="bg-[#15161f] p-5 rounded-2xl flex flex-col space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Priority Breakdown</h3>
          <p className="text-xs text-slate-400">Task distribution by severity & column</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232733" vertical={false} />
            <XAxis
              dataKey="status"
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
            <Bar dataKey="high" name="High Priority" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="low" name="Low Priority" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
