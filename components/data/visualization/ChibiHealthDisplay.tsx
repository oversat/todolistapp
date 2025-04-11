import { useTaskAnalytics } from '@/hooks/useTaskAnalytics';
import { useChibiStats } from '@/hooks/useChibiStats';

interface ChibiHealthDisplayProps {
  chibiId: string;
}

export function ChibiHealthDisplay({ chibiId }: ChibiHealthDisplayProps) {
  const { analytics, loading: analyticsLoading } = useTaskAnalytics(chibiId);
  const { stats, loading: statsLoading } = useChibiStats(chibiId);

  if (analyticsLoading || statsLoading) {
    return (
      <div className="animate-pulse font-vt323 text-[#33ff33]">LOADING...</div>
    );
  }

  // Calculate health hearts (max 4)
  const healthHearts = Math.round((stats?.health || 0) / 25);
  // Calculate discipline bar (percentage)
  const disciplineLevel = analytics.completionRate;

  return (
    <div className="bg-[#000000] rounded-xl p-4 font-vt323 text-[#33ff33] border border-[#33ff33]/20">
      <div className="space-y-4">
        {/* Top Stats */}
        <div className="flex justify-between items-start">
          <div className="text-center">
            <span className="text-xl">{analytics.completed}</span>
            <span className="text-sm ml-1">tasks</span>
          </div>
          <div className="text-center">
            <span className="text-xl">{analytics.pending}</span>
            <span className="text-sm ml-1">todo</span>
          </div>
        </div>

        {/* Health Hearts */}
        <div className="flex items-center gap-1">
          <span className="text-sm min-w-[80px]">Health</span>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <span key={i} className={i < healthHearts ? 'text-[#33ff33]' : 'text-[#1a1a1a]'}>
                ♥
              </span>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="flex items-center gap-1">
          <span className="text-sm min-w-[80px]">Energy</span>
          <div className="flex-1 h-3 bg-[#1a1a1a] rounded-sm overflow-hidden">
            <div 
              className="h-full bg-[#33ff33]" 
              style={{ width: `${stats?.energy || 0}%` }}
            />
          </div>
        </div>

        {/* Discipline (Task Completion) */}
        <div className="flex items-center gap-1">
          <span className="text-sm min-w-[80px]">Discipline</span>
          <div className="flex-1 h-3 bg-[#1a1a1a] rounded-sm overflow-hidden">
            <div 
              className="h-full bg-[#33ff33]" 
              style={{ width: `${disciplineLevel}%` }}
            />
          </div>
        </div>

        {/* Weight (Total Tasks) */}
        <div className="text-center mt-2">
          <span className="text-2xl">{analytics.completed + analytics.pending}</span>
          <span className="text-sm ml-1">total tasks</span>
        </div>
      </div>
    </div>
  );
} 