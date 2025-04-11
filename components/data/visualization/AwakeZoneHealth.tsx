import { Clock, MessageSquare } from 'lucide-react';
import { useChibiStats } from '@/hooks/useChibiStats';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Add keyframes for the pulsing glow
const pulseGlowStyle = `
  @keyframes pulseGlow {
    0% { 
      box-shadow: 0 0 2px #29cc29,
                 0 0 4px #29cc29,
                 0 0 6px rgba(41, 204, 41, 0.7),
                 0 0 8px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.15);
    }
    50% { 
      box-shadow: 0 0 4px #29cc29,
                 0 0 8px #29cc29,
                 0 0 12px rgba(41, 204, 41, 0.7),
                 0 0 24px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.3);
    }
    100% { 
      box-shadow: 0 0 2px #29cc29,
                 0 0 4px #29cc29,
                 0 0 6px rgba(41, 204, 41, 0.7),
                 0 0 8px rgba(41, 204, 41, 0.6);
      background: rgba(41, 204, 41, 0.15);
    }
  }

  @keyframes pulseGlowPink {
    0% { 
      box-shadow: 0 0 2px #ff69b4,
                 0 0 4px #ff69b4,
                 0 0 6px rgba(255, 105, 180, 0.7),
                 0 0 8px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.15);
    }
    50% { 
      box-shadow: 0 0 4px #ff69b4,
                 0 0 8px #ff69b4,
                 0 0 12px rgba(255, 105, 180, 0.7),
                 0 0 24px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.3);
    }
    100% { 
      box-shadow: 0 0 2px #ff69b4,
                 0 0 4px #ff69b4,
                 0 0 6px rgba(255, 105, 180, 0.7),
                 0 0 8px rgba(255, 105, 180, 0.6);
      background: rgba(255, 105, 180, 0.15);
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

  @keyframes popIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .pop-in {
    animation: popIn 0.3s ease-out forwards;
  }
`;

interface AwakeZoneHealthProps {
  chibiId: string;
  onTaskStatusChange?: (hasNotes: boolean, hasDueDate: boolean) => void;
  immediateUpdate?: {
    discipline?: number;
    noteHearts?: number;
  };
}

export function AwakeZoneHealth({ chibiId, onTaskStatusChange, immediateUpdate }: AwakeZoneHealthProps) {
  const { stats, loading } = useChibiStats(chibiId);
  const [localHearts, setLocalHearts] = useState({
    discipline: 0,
    noteHearts: 0
  });
  const [showNewIcon, setShowNewIcon] = useState<{
    discipline?: boolean;
    notes?: boolean;
  }>({});

  // Update local state when stats change or immediateUpdate is provided
  useEffect(() => {
    if (immediateUpdate) {
      setLocalHearts({
        discipline: immediateUpdate.discipline ?? localHearts.discipline,
        noteHearts: immediateUpdate.noteHearts ?? localHearts.noteHearts
      });
    } else if (stats) {
      setLocalHearts({
        discipline: stats.discipline,
        noteHearts: Math.min(stats.noteHearts, 4)
      });
    }
  }, [stats, immediateUpdate]);

  // Handle task status changes
  useEffect(() => {
    if (onTaskStatusChange) {
      const hasNotes = localHearts.noteHearts > 0;
      const hasDueDate = localHearts.discipline > 0;
      onTaskStatusChange(hasNotes, hasDueDate);
    }
  }, [localHearts, onTaskStatusChange]);

  // Show new icon animation when status changes
  useEffect(() => {
    if (localHearts.discipline > 0) {
      setShowNewIcon(prev => ({ ...prev, discipline: true }));
      const timer = setTimeout(() => setShowNewIcon(prev => ({ ...prev, discipline: false })), 300);
      return () => clearTimeout(timer);
    }
  }, [localHearts.discipline]);

  useEffect(() => {
    if (localHearts.noteHearts > 0) {
      setShowNewIcon(prev => ({ ...prev, notes: true }));
      const timer = setTimeout(() => setShowNewIcon(prev => ({ ...prev, notes: false })), 300);
      return () => clearTimeout(timer);
    }
  }, [localHearts.noteHearts]);

  if (loading || !stats) return (
    <div className="font-vt323 text-[#33ff33] animate-pulse">
      LOADING DATA...
    </div>
  );

  return (
    <div className="text-right">
      <div className="text-[#33ff33] mb-2">Health</div>
      <div className="flex gap-1 justify-end">
        {/* Clock Icons (Due Date) */}
        {Array.from({ length: 4 }).map((_, index) => (
          <Clock
            key={`deadline-${index}`}
            className={cn(
              "h-4 w-4 text-[#ff69b4]",
              index < localHearts.discipline && "pulse-glow-pink",
              showNewIcon.discipline && index === localHearts.discipline - 1 && "pop-in"
            )}
          />
        ))}
        {/* Message Icons (Notes) */}
        {Array.from({ length: 4 }).map((_, index) => (
          <MessageSquare
            key={`notes-${index}`}
            className={cn(
              "h-4 w-4 text-[#33ff33]",
              index < localHearts.noteHearts && "pulse-glow-green",
              showNewIcon.notes && index === localHearts.noteHearts - 1 && "pop-in"
            )}
          />
        ))}
      </div>
      <style jsx global>{pulseGlowStyle}</style>
    </div>
  );
} 