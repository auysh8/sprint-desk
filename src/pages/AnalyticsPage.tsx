import React, { useEffect, useState, useMemo } from 'react';
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
import { Button } from '../components/ui/Button';
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
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sprint Analytics & Metrics
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Live Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance, completion velocity, and priority allocation metrics.
          </p>
        </div>

        {/* Action Controls: Date Range & Export */}
        <div className="flex items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center bg-[#13151c] p-1 rounded-xl border border-white/5">
            {rangeOptions.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setSelectedRangeDays(opt.days)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                  selectedRangeDays === opt.days
                    ? 'bg-[#222533] text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="h-4 w-4" />}
            className="border-white/10 hover:bg-[#1a1d28] text-slate-300"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sprint Velocity</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">
              {metrics.estimatedVelocityPoints}
            </span>
            <span className="text-xs text-purple-400 block mt-0.5">Story Points</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-400">
              {metrics.completionRate}%
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {metrics.completedTasks} of {metrics.totalTasks} tasks done
            </span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">In Progress / Review</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-400">
              {metrics.inProgressTasks + metrics.reviewTasks}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Active in sprint workflow</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Overdue Tasks</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-400">
              {metrics.overdueTasks}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Requires immediate attention</span>
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
