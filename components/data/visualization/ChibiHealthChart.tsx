import { Heart } from 'lucide-react';
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
      {/* Deadline Hearts */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-vt323 text-[#33ff33] text-lg">
          Deadline Hearts: {stats.deadlineHearts}/4
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Heart
              key={`deadline-${index}`}
              className={`w-6 h-6 ${
                index < stats.deadlineHearts ? 'text-[#ff69b4] fill-[#ff69b4]' : 'text-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Notes Hearts */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-vt323 text-[#33ff33] text-lg">
          Notes Hearts: {stats.noteHearts}/4
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Heart
              key={`notes-${index}`}
              className={`w-6 h-6 ${
                index < stats.noteHearts ? 'text-[#33ff33] fill-[#33ff33]' : 'text-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 