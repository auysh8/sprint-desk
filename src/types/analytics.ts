export interface SprintVelocityData {
  sprintId: number;
  sprintName: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number; // percentage (0-100)
}

export interface StatusDistributionData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PriorityBreakdownData {
  status: string;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface CompletionTrendData {
  date: string;
  completedCount: number;
  cumulativeCompleted: number;
}

export interface DateRangeFilter {
  startDate: string | null;
  endDate: string | null;
}
