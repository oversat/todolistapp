import { useChibiStats } from '@/hooks/useChibiStats';

export function ChibiHealthChart({ chibiId }: { chibiId: string }) {
  const { stats, loading } = useChibiStats(chibiId);

  if (loading || !stats) return (
    <div className="font-vt323 text-[#33ff33] animate-pulse">
      LOADING DATA...
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Discipline */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-vt323 text-[#33ff33] text-lg">
          Discipline: {stats.discipline}%
        </div>
        <div className="w-48 h-12 bg-[#1a1a1a] rounded-sm overflow-hidden relative">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-r border-[#33ff33]/20" />
            ))}
          </div>
          {/* Graph bar */}
          <div 
            className="absolute bottom-0 left-0 h-full bg-[#33ff33]/80" 
            style={{ width: `${stats.discipline}%` }}
          />
        </div>
      </div>
    </div>
  );
} 