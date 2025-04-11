import React, { useState, useEffect } from 'react';
import { Check, Edit2, Trash2, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChibiStats } from '@/hooks/useChibiStats';

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
`;

interface TaskProps {
  id: string;
  text: string;
  completed?: boolean;
  disabled?: boolean;
  notes?: string;
  due_date?: string;
  created_at: string;
  chibiId?: string;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onNotesChange?: (notes: string) => void;
  onDueDateChange?: (date: string) => void;
}

export function Task({
  id,
  text,
  completed,
  disabled,
  notes = '',
  due_date,
  created_at,
  chibiId,
  onComplete,
  onEdit,
  onDelete,
  onNotesChange,
  onDueDateChange,
}: TaskProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [hasUnsavedNotes, setHasUnsavedNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(due_date || '');
  const [isSavingDate, setIsSavingDate] = useState(false);
  const { stats, updateTask, updateChibiStats } = useChibiStats(chibiId || '');
  const { stats: chibiStats } = useChibiStats(chibiId || '');
  const [localHearts, setLocalHearts] = useState({
    deadlineHearts: stats?.deadlineHearts || 0,
    noteHearts: stats?.noteHearts || 0
  });
  const createdDate = new Date(created_at).toLocaleDateString();
  const createdTime = new Date(created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Update local state when props change
  useEffect(() => {
    setLocalNotes(notes);
    setLocalDueDate(due_date || '');
  }, [notes, due_date]);

  // Update local hearts when stats change
  useEffect(() => {
    if (stats) {
      setLocalHearts({
        deadlineHearts: stats.deadlineHearts,
        noteHearts: stats.noteHearts
      });
    }
  }, [stats]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    setHasUnsavedNotes(newNotes !== notes);
  };

  const handleSaveNotes = async () => {
    if (!onNotesChange) return;
    setIsSaving(true);
    try {
      // Update local state immediately
      if (chibiId) {
        updateTask(id, { notes: localNotes });
      }
      // Then save to server
      await onNotesChange(localNotes);
      setHasUnsavedNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      // Revert on error
      setLocalNotes(notes);
      if (chibiId) {
        updateTask(id, { notes });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLocalDueDate(newDate);
  };

  const handleSaveDueDate = async () => {
    if (!onDueDateChange) return;
    setIsSavingDate(true);
    try {
      // Update local state immediately
      if (chibiId) {
        updateTask(id, { due_date: localDueDate });
      }
      // Then save to server
      await onDueDateChange(localDueDate);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error saving due date:', error);
      // Revert on error
      setLocalDueDate(due_date || '');
      if (chibiId) {
        updateTask(id, { due_date });
      }
    } finally {
      setIsSavingDate(false);
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleComplete = async () => {
    if (onComplete) {
      // Update chibi stats before completing the task
      if (chibiId && stats) {
        await updateChibiStats({
          energy: Math.max(0, (stats.energy || 0) - 10),  // Decrease energy
          hunger: Math.min(100, (stats.hunger || 0) + 10) // Increase hunger
        });
      }
      onComplete();
    }
  };

  return (
    <div className={cn(
      'flex flex-col border-2 border-gray-400 bg-gray-200 relative',
      'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      'w-full max-w-[200px] mx-auto transition-all duration-200',
      completed && 'opacity-50'
    )}>
      {/* Title Bar */}
      <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between relative z-[30]">
        <span className="font-bold text-xs truncate flex-1">{text}</span>
        <div className="flex gap-1">
          {!disabled && (
            <>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={cn(
                  "text-white hover:bg-[#1084d0] p-0.5 relative",
                  localDueDate && "pulse-glow-pink"
                )}
                title={localDueDate ? `Due: ${formatDueDate(localDueDate)}` : "Set Due Date"}
              >
                <Clock size={10} />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={cn(
                  "text-white hover:bg-[#1084d0] p-0.5 relative",
                  localNotes && localNotes.trim() !== "" && "pulse-glow-green"
                )}
                title={localNotes && localNotes.trim() !== "" ? "View Notes" : "Add Notes"}
              >
                <MessageSquare size={10} />
              </button>
            </>
          )}
          {!disabled && onEdit && (
            <button
              onClick={onEdit}
              className="text-white hover:bg-[#1084d0] p-0.5"
              title="Edit Task Title"
            >
              <Edit2 size={10} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-white hover:bg-[#1084d0] p-0.5"
              title="Delete Task"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 space-y-1 flex-1 flex flex-col text-xs relative z-[20]">
        <div className="flex items-start gap-2">
          {/* Checkbox */}
          <button
            onClick={handleComplete}
            disabled={disabled}
            className={cn(
              'w-4 h-4 border-2 border-gray-600 flex items-center justify-center bg-white',
              'shadow-[inset_-1px_-1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(0,0,0,0.3)]'
            )}
          >
            {completed && <Check size={10} />}
          </button>

          {/* Task Details */}
          <div className="flex-1 space-y-1 min-w-0">
            {/* Date Picker */}
            {showDatePicker && (
              <div className="space-y-1 absolute left-0 right-0 bg-gray-200 border border-gray-400 p-2 shadow-lg z-[40]">
                <input
                  type="date"
                  value={localDueDate}
                  onChange={handleDueDateChange}
                  className="w-full text-[10px] p-1 border border-gray-400 bg-white text-black"
                />
                <button
                  onClick={handleSaveDueDate}
                  disabled={isSavingDate || !localDueDate}
                  className={cn(
                    "w-full text-[10px] py-0.5 px-2 transition-colors text-center",
                    isSavingDate 
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#000080] text-white hover:bg-[#1084d0]"
                  )}
                >
                  {isSavingDate ? "SAVING..." : "SET DUE DATE"}
                </button>
              </div>
            )}
            
            {/* Notes Section */}
            {showNotes && (
              <div className="mt-2 bg-gray-200 border border-gray-400 p-2 shadow-lg">
                <textarea
                  value={localNotes}
                  onChange={handleNotesChange}
                  className="w-full h-20 text-[10px] p-1 border border-gray-400 bg-white text-black resize-none mb-2"
                  placeholder="Add notes..."
                />
                {hasUnsavedNotes && (
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className={cn(
                      "w-full text-[10px] py-0.5 px-2 transition-colors text-center",
                      isSaving 
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#000080] text-white hover:bg-[#1084d0]"
                    )}
                  >
                    {isSaving ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-0.5 mt-2">
          <div className="text-[8px] text-gray-500 font-mono">
            Created: {createdDate} {createdTime}
          </div>
          {due_date && (
            <div className="text-[8px] text-gray-800 font-mono font-bold">
              Due: {formatDueDate(due_date)}
            </div>
          )}
        </div>
      </div>

      {/* Add the keyframes style to the document */}
      <style jsx global>{pulseGlowStyle}</style>
    </div>
  );
} 