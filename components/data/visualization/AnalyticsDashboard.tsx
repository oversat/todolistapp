import { Card } from '@/components/layout/card';
import { TaskAnalyticsChart } from './TaskAnalyticsChart';
import { ChibiHealthChart } from './ChibiHealthChart';
import { Progress } from '@/components/data/progress';
import { useTaskAnalytics } from '@/hooks/useTaskAnalytics';
import { useChibiStats } from '@/hooks/useChibiStats';

interface AnalyticsDashboardProps {
  chibiId: string;
}

export function AnalyticsDashboard({ chibiId }: AnalyticsDashboardProps) {
  const { analytics, loading: analyticsLoading } = useTaskAnalytics(chibiId);
  const { stats, loading: statsLoading } = useChibiStats(chibiId);

  if (analyticsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse font-vt323 text-[#33ff33]">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] p-3 rounded-sm border border-[#33ff33]/30">
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="font-vt323 text-sm text-[#33ff33] mb-1">COMPLETION</h3>
          <p className="font-vt323 text-2xl text-[#33ff33]">{analytics.completionRate.toFixed(1)}%</p>
          <div className="mt-1 h-1 bg-[#0a0a0a] rounded-sm overflow-hidden">
            <div 
              className="h-full bg-[#33ff33]" 
              style={{ width: `${analytics.completionRate}%` }}
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-vt323 text-sm text-[#33ff33] mb-1">DONE</h3>
          <p className="font-vt323 text-2xl text-[#33ff33]">{analytics.completed}</p>
          <p className="font-vt323 text-xs text-[#33ff33]">/{analytics.completed + analytics.pending}</p>
        </div>
        <div className="text-center">
          <h3 className="font-vt323 text-sm text-[#33ff33] mb-1">TODO</h3>
          <p className="font-vt323 text-2xl text-[#33ff33]">{analytics.pending}</p>
          <p className="font-vt323 text-xs text-[#33ff33]">remaining</p>
        </div>
      </div>
    </div>
  );
} 