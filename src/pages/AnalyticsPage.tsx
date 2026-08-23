import React from 'react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sprint Analytics & Performance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recharts velocity, status distribution, and burndown trends
          </p>
        </div>
      </div>
      <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Analytics Visualizations will be implemented in Phase 7
      </div>
    </div>
  );
};

export default AnalyticsPage;
