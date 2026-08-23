import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import {
  getVelocityData,
  getStatusDistribution,
  getPriorityBreakdown,
  getCompletionTrend,
  getSprintSummaryMetrics,
} from '../utils/analyticsUtils';
import { SprintVelocityChart } from '../components/analytics/SprintVelocityChart';
import { StatusDistributionChart } from '../components/analytics/StatusDistributionChart';
import { PriorityMatrixChart } from '../components/analytics/PriorityMatrixChart';
import { CompletionTrendChart } from '../components/analytics/CompletionTrendChart';
import { useToast } from '../components/ui/Toast/ToastContext';
import { cn } from '../utils/cn';

export const AnalyticsPage: React.FC = () => {
  const { tasks, sprints, loadBoardData } = useBoardStore();
  const { success } = useToast();
  const [selectedRangeDays, setSelectedRangeDays] = useState<number>(14);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  const velocityData = useMemo(() => getVelocityData(tasks, sprints), [tasks, sprints]);
  const statusDistribution = useMemo(() => getStatusDistribution(tasks), [tasks]);
  const priorityBreakdown = useMemo(() => getPriorityBreakdown(tasks), [tasks]);
  const completionTrend = useMemo(
    () => getCompletionTrend(tasks, selectedRangeDays),
    [tasks, selectedRangeDays]
  );
  const metrics = useMemo(() => getSprintSummaryMetrics(tasks), [tasks]);

  const handleExportData = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      sprintMetrics: metrics,
      statusDistribution,
      priorityBreakdown,
      velocityData,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sprintdesk_analytics_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    success('Report Exported', 'Sprint metrics snapshot downloaded as JSON.');
  };

  const rangeOptions = [
    { label: '7 Days', days: 7 },
    { label: '14 Days', days: 14 },
    { label: '30 Days', days: 30 },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-neutral-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Sprint Analytics
          </h1>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 shadow-xs">
            Live Metrics
          </span>
        </div>

        {/* Action Controls: Date Range with Animated Sliding Pill & Tonal Export */}
        <div className="flex items-center gap-3">
          {/* Date Range Selector with Sliding Pill */}
          <div className="flex items-center bg-[#0c0c0e] p-1 rounded-2xl shadow-xs">
            {rangeOptions.map((opt) => {
              const isSelected = selectedRangeDays === opt.days;
              return (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setSelectedRangeDays(opt.days)}
                  className={cn(
                    'relative px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer',
                    isSelected
                      ? 'text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="analytics-range-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-md shadow-white/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* High-Contrast Export Button */}
          <button
            type="button"
            onClick={handleExportData}
            className="bg-white hover:bg-neutral-100 active:bg-neutral-200 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards — Reference-Inspired Solid Vibrant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sprint Velocity (Violet) */}
        <div className="bg-[#8a5df5] p-5 rounded-3xl flex flex-col justify-between shadow-lg shadow-black/20 text-white space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/90 font-extrabold uppercase tracking-wider">Sprint Velocity</span>
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <Zap className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">
              {metrics.estimatedVelocityPoints}
            </span>
            <span className="text-xs text-white/90 block mt-0.5 font-bold">Story Points</span>
          </div>
        </div>

        {/* Card 2: Completion Rate (Mint Green) */}
        <div className="bg-[#50c878] p-5 rounded-3xl flex flex-col justify-between shadow-lg shadow-black/20 text-[#062612] space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#062612]/80 font-extrabold uppercase tracking-wider">Completion Rate</span>
            <div className="p-2 rounded-xl bg-black/10 text-[#062612]">
              <TrendingUp className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-[#062612]">
              {metrics.completionRate}%
            </span>
            <span className="text-xs text-[#062612] block mt-0.5 font-extrabold">
              {metrics.completedTasks} of {metrics.totalTasks} tasks done
            </span>
          </div>
        </div>

        {/* Card 3: In Progress / Review (Warm Amber) */}
        <div className="bg-[#f4d35e] p-5 rounded-3xl flex flex-col justify-between shadow-lg shadow-black/20 text-[#2b1d03] space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#2b1d03]/80 font-extrabold uppercase tracking-wider">In Progress / Review</span>
            <div className="p-2 rounded-xl bg-black/10 text-[#2b1d03]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-[#2b1d03]">
              {metrics.inProgressTasks + metrics.reviewTasks}
            </span>
            <span className="text-xs text-[#2b1d03] block mt-0.5 font-bold">Active in sprint workflow</span>
          </div>
        </div>

        {/* Card 4: Overdue Tasks (Coral Peach) */}
        <div className="bg-[#f37a6b] p-5 rounded-3xl flex flex-col justify-between shadow-lg shadow-black/20 text-[#2d080c] space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#2d080c]/80 font-extrabold uppercase tracking-wider">Overdue Tasks</span>
            <div className="p-2 rounded-xl bg-black/10 text-[#2d080c]">
              <AlertTriangle className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-[#2d080c]">
              {metrics.overdueTasks}
            </span>
            <span className="text-xs text-[#2d080c] block mt-0.5 font-bold">Requires attention</span>
          </div>
        </div>
      </div>

      {/* 2x2 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Chart 1: Sprint Velocity */}
        <SprintVelocityChart data={velocityData} />

        {/* Chart 2: Status Distribution */}
        <StatusDistributionChart
          data={statusDistribution}
          totalTasks={metrics.totalTasks}
        />

        {/* Chart 3: Priority Matrix */}
        <PriorityMatrixChart data={priorityBreakdown} />

        {/* Chart 4: Completion Velocity Trend */}
        <CompletionTrendChart data={completionTrend} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
