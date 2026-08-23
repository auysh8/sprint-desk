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
      <div className="rounded-2xl bg-[#161619] p-3.5 shadow-2xl shadow-black text-xs space-y-1.5 border-0">
        <p className="font-bold text-white mb-1.5">{label} Column</p>
        <p className="text-[#fca5a5]">
          High: <span className="font-bold text-white">{payload[0]?.value}</span>
        </p>
        <p className="text-[#fde047]">
          Medium: <span className="font-bold text-white">{payload[1]?.value}</span>
        </p>
        <p className="text-[#7dd3fc]">
          Low: <span className="font-bold text-white">{payload[2]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const PriorityMatrixChart: React.FC<PriorityMatrixChartProps> = ({ data }) => {
  return (
    <div className="bg-[#0c0c0e] p-6 rounded-3xl flex flex-col space-y-4 shadow-xl shadow-black/80">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Priority Breakdown</h3>
          <p className="text-xs text-neutral-400 font-medium">Task distribution by severity & column</p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f24" vertical={false} />
            <XAxis
              dataKey="status"
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              interval={0}
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
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)', rx: 8, ry: 8 }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              formatter={(value) => <span className="text-neutral-300 font-semibold ml-1">{value}</span>}
              iconType="circle"
            />
            <Bar dataKey="high" name="High Priority" stackId="a" fill="#f37a6b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#f4d35e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="low" name="Low Priority" stackId="a" fill="#38b6ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
