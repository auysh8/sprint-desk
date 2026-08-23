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
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sprint Analytics & Metrics
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Live Data
          </span>
        </div>

        {/* Action Controls: Date Range with Animated Sliding Pill & M3 Tonal Export */}
        <div className="flex items-center gap-2.5">
          {/* Date Range Selector with Sliding Pill */}
          <div className="flex items-center bg-[#15161f] p-1 rounded-full shadow-xs">
            {rangeOptions.map((opt) => {
              const isSelected = selectedRangeDays === opt.days;
              return (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setSelectedRangeDays(opt.days)}
                  className={cn(
                    'relative px-3.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer',
                    isSelected
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="analytics-range-pill"
                      className="absolute inset-0 bg-[#252736] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* M3 Tonal Export Button */}
          <button
            type="button"
            onClick={handleExportData}
            className="bg-[#1d1e2a] hover:bg-[#252736] text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-300" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards — Colorful Dark Tonal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sprint Velocity (Violet) */}
        <div className="bg-[#201830] p-5 rounded-2xl flex flex-col justify-between shadow-md shadow-black/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">Sprint Velocity</span>
            <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-300">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-violet-100">
              {metrics.estimatedVelocityPoints}
            </span>
            <span className="text-xs text-violet-300/80 block mt-0.5 font-medium">Story Points</span>
          </div>
        </div>

        {/* Card 2: Completion Rate (Emerald) */}
        <div className="bg-[#12221b] p-5 rounded-2xl flex flex-col justify-between shadow-md shadow-black/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Completion Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-200">
              {metrics.completionRate}%
            </span>
            <span className="text-xs text-emerald-400 block mt-0.5 font-semibold">
              {metrics.completedTasks} of {metrics.totalTasks} tasks done
            </span>
          </div>
        </div>

        {/* Card 3: In Progress / Review (Amber) */}
        <div className="bg-[#241c14] p-5 rounded-2xl flex flex-col justify-between shadow-md shadow-black/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">In Progress / Review</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-200">
              {metrics.inProgressTasks + metrics.reviewTasks}
            </span>
            <span className="text-xs text-amber-300/80 block mt-0.5 font-medium">Active in sprint workflow</span>
          </div>
        </div>

        {/* Card 4: Overdue Tasks (Rose) */}
        <div className="bg-[#28151c] p-5 rounded-2xl flex flex-col justify-between shadow-md shadow-black/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-bold uppercase tracking-wider">Overdue Tasks</span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-200">
              {metrics.overdueTasks}
            </span>
            <span className="text-xs text-rose-300/80 block mt-0.5 font-medium">Requires immediate attention</span>
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
