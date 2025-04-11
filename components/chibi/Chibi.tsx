import React, { useState } from 'react';
import Image from 'next/image';
import { Skull, Clock, MessageSquare } from 'lucide-react';
import { DeleteChibiDialog } from './DeleteChibiDialog';
import { useChibiStats } from '@/hooks/useChibiStats';
import { cn } from '@/lib/utils';

interface ChibiProps {
  id?: string;
  name: string;
  image: string;
  tasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  happiness?: number;
  energy?: number;
  onSelect?: () => void;
  onDelete?: () => void;
}

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

export function Chibi({ 
  id, 
  name, 
  image, 
  tasks = [], 
  happiness = 0,
  energy = 0,
  onSelect, 
  onDelete 
}: ChibiProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { stats } = useChibiStats(id || '');

  // Cap the values at 4
  const cappedDeadlineHearts = Math.min(stats?.deadlineHearts || 0, 4);
  const cappedNoteHearts = Math.min(stats?.noteHearts || 0, 4);

  console.log('Chibi component rendered with props:', { id, name, onDelete });

  const handleDeleteClick = (e: React.MouseEvent) => {
    console.log('Delete button clicked');
    e.stopPropagation();
    if (onDelete) {
      console.log('onDelete handler exists, showing dialog');
      setShowDeleteDialog(true);
    } else {
      console.log('No onDelete handler provided');
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageError(true);
  };

  const activeTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center w-full bg-[#d4d0c8] bg-opacity-90 rounded-lg p-6 shadow-md relative">
        <Skull 
          className="absolute top-2 right-2 h-6 w-6 text-red-500 cursor-pointer hover:text-red-700 z-10" 
          onClick={handleDeleteClick}
        />
        <div className="absolute top-2 right-10 flex gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Clock
              key={`deadline-${index}`}
              className={cn(
                "h-4 w-4 text-[#ff69b4] heart-icon",
                index < cappedDeadlineHearts && "active pulse-glow-pink"
              )}
            />
          ))}
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <MessageSquare
              key={`notes-${index}`}
              className={cn(
                "h-4 w-4 text-[#33ff33] heart-icon",
                index < cappedNoteHearts && "active pulse-glow-green"
              )}
            />
          ))}
        </div>
        <div 
          className="relative w-48 h-48 mx-auto cursor-pointer transform transition-transform hover:scale-105 mb-4"
          onClick={onSelect}
        >
          {!imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
        </div>
        <h3 className="font-vt323 text-4xl text-black mb-4">{name}</h3>
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-vt323 text-2xl text-black min-w-[140px] text-left">
              <span># Tasks:</span>
            </div>
            <div className="flex-1 h-6 bg-[#1a1a1a] rounded-sm overflow-hidden border border-black flex items-center justify-center">
              <span className="text-white font-vt323 text-xl">{activeTasks}</span>
            </div>
          </div>
        </div>
      </div>

      <DeleteChibiDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          console.log('Delete dialog closed');
          setShowDeleteDialog(false);
        }}
        onConfirm={() => {
          console.log('Delete confirmed in Chibi component');
          if (onDelete) {
            console.log('Calling onDelete handler');
            onDelete();
          }
          setShowDeleteDialog(false);
        }}
        chibiName={name}
      />

      {/* Add the keyframes style to the document */}
      <style jsx global>{pulseGlowStyle}</style>
    </div>
  );
} 