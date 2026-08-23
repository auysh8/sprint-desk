import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { StatusDistributionData } from '../../types/analytics';
import { cn } from '../../utils/cn';

export interface StatusDistributionChartProps {
  data: StatusDistributionData[];
  totalTasks: number;
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  totalTasks,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="bg-[#15161f] p-5 rounded-2xl flex flex-col space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Status Distribution</h3>
          <p className="text-xs text-slate-400">Current workflow breakdown</p>
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={4}
              dataKey="count"
              animationDuration={600}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="cursor-pointer outline-none focus:outline-none"
            >
              {data.map((entry, index) => {
                const isActive = activeIndex === index;
                const isAnyActive = activeIndex !== null;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isActive ? '#ffffff' : '#15161f'}
                    strokeWidth={isActive ? 3 : 2}
                    opacity={!isAnyActive || isActive ? 1 : 0.45}
                    className="transition-all duration-200"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Dynamic Center HUD HUD */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key={`hover-${activeItem.status}`}
                initial={{ opacity: 0, scale: 0.9, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -2 }}
                transition={{ duration: 0.14 }}
                className="flex flex-col items-center justify-center text-center max-w-[105px] px-1"
              >
                <span
                  className="text-2xl font-bold tracking-tight leading-tight"
                  style={{ color: activeItem.color }}
                >
                  {activeItem.count}
                </span>
                <span
                  className="text-[10px] tracking-wider uppercase font-semibold truncate w-full mt-0.5 leading-tight"
                  style={{ color: activeItem.color }}
                >
                  {activeItem.status}
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  ({Math.round((activeItem.count / (totalTasks || 1)) * 100)}%)
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="total-count"
                initial={{ opacity: 0, scale: 0.9, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -2 }}
                transition={{ duration: 0.14 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl font-bold text-slate-100 leading-tight">{totalTasks}</span>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium mt-0.5 leading-tight">
                  Total Tasks
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Interactive Legend */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {data.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={item.status}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={cn(
                'flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer select-none shadow-xs',
                isActive
                  ? 'bg-[#252736] shadow-sm'
                  : 'bg-[#1d1e2a] hover:bg-[#252736]'
              )}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.status}</span>
              </div>
              <span className="font-semibold text-slate-200 shrink-0 ml-1.5">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
