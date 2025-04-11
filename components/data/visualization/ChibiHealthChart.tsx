import { Heart } from 'lucide-react';
import { useChibiStats } from '@/hooks/useChibiStats';
import { cn } from '@/lib/utils';

// Add keyframes for the pulsing glow
const pulseGlowStyle = `
  @keyframes pulseGlow {
    0% { 
      box-shadow: 0 0 2px #29cc29,
                 0 0 4px #29cc29,
                 0 0 6px rgba(41, 204, 41, 0.7),
                 0 0 8px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.15);
      opacity: 0.3;
    }
    50% { 
      box-shadow: 0 0 4px #29cc29,
                 0 0 8px #29cc29,
                 0 0 12px rgba(41, 204, 41, 0.7),
                 0 0 24px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.3);
      opacity: 1;
    }
    100% { 
      box-shadow: 0 0 2px #29cc29,
                 0 0 4px #29cc29,
                 0 0 6px rgba(41, 204, 41, 0.7),
                 0 0 8px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.15);
      opacity: 0.3;
    }
  }

  @keyframes pulseGlowPink {
    0% { 
      box-shadow: 0 0 2px #ff69b4,
                 0 0 4px #ff69b4,
                 0 0 6px rgba(255, 105, 180, 0.7),
                 0 0 8px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.15);
      opacity: 0.3;
    }
    50% { 
      box-shadow: 0 0 4px #ff69b4,
                 0 0 8px #ff69b4,
                 0 0 12px rgba(255, 105, 180, 0.7),
                 0 0 24px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.3);
      opacity: 1;
    }
    100% { 
      box-shadow: 0 0 2px #ff69b4,
                 0 0 4px #ff69b4,
                 0 0 6px rgba(255, 105, 180, 0.7),
                 0 0 8px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.15);
      opacity: 0.3;
    }
  }

  .pulse-glow-green {
    animation: pulseGlow 3s infinite;
    border-radius: 60%;
    position: relative;
    z-index: 1;
  }

  .pulse-glow-pink {
    animation: pulseGlowPink 3s infinite;
    border-radius: 60%;
    position: relative;
    z-index: 1;
  }

  .heart-icon {
    opacity: 0.1;
    transition: opacity 0.3s ease;
  }

  .heart-icon.active {
    opacity: 1;
  }
`;

export function ChibiHealthChart({ chibiId }: { chibiId: string }) {
  const { stats, loading } = useChibiStats(chibiId);

  if (loading || !stats) return (
    <div className="font-vt323 text-[#33ff33] animate-pulse">
      LOADING DATA...
    </div>
  );

  // Cap the values at 4
  const cappedDeadlineHearts = Math.min(stats.deadlineHearts, 4);
  const cappedNoteHearts = Math.min(stats.noteHearts, 4);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Deadline Hearts */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-vt323 text-[#33ff33] text-lg">
          Deadline Hearts: {cappedDeadlineHearts}/4
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Heart
              key={`deadline-${index}`}
              className={cn(
                "w-6 h-6 heart-icon",
                index < cappedDeadlineHearts 
                  ? "text-[#ff69b4] fill-[#ff69b4] active pulse-glow-pink" 
                  : "text-gray-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* Notes Hearts */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-vt323 text-[#33ff33] text-lg">
          Notes Hearts: {cappedNoteHearts}/4
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Heart
              key={`notes-${index}`}
              className={cn(
                "w-6 h-6 heart-icon",
                index < cappedNoteHearts 
                  ? "text-[#33ff33] fill-[#33ff33] active pulse-glow-green" 
                  : "text-gray-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* Add the keyframes style to the document */}
      <style jsx global>{pulseGlowStyle}</style>
    </div>
  );
} 