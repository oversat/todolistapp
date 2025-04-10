import React, { useState } from 'react';
import { Check, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProps {
  id: string;
  text: string;
  description?: string;
  notes?: string;
  dueDate?: Date;
  createdAt?: Date;
  completed: boolean;
  disabled?: boolean;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onNotesChange?: (notes: string) => void;
}

export function Task({ 
  id, 
  text,
  description,
  notes = '',
  dueDate,
  createdAt = new Date(),
  completed, 
  disabled = false,
  onComplete,
  onEdit,
  onDelete,
  onNotesChange
}: TaskProps) {
  const [showNotes, setShowNotes] = useState(true);
  const [localNotes, setLocalNotes] = useState(notes);
  const [hasUnsavedNotes, setHasUnsavedNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formattedDate = createdAt.toLocaleDateString();
  const formattedTime = createdAt.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    setHasUnsavedNotes(newNotes !== notes);
  };

  const handleSaveNotes = async () => {
    if (!onNotesChange) return;
    
    setIsSaving(true);
    try {
      await onNotesChange(localNotes);
      setHasUnsavedNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      // Keep the unsaved state if there was an error
      setHasUnsavedNotes(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn(
      'flex flex-col border-2 border-gray-400 bg-gray-200',
      'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      'w-full max-w-[200px] mx-auto transition-all duration-200',
      showNotes ? 'h-[180px]' : 'h-[120px]',
      completed && 'opacity-50'
    )}>
      {/* Title Bar */}
      <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">
        <span className="font-bold text-xs truncate flex-1">{text}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-white hover:bg-[#1084d0] p-0.5"
          >
            <MessageSquare size={10} />
          </button>
          <button
            onClick={onEdit}
            className="text-white hover:bg-[#1084d0] p-0.5"
          >
            <Edit2 size={10} />
          </button>
          <button
            onClick={onDelete}
            className="text-white hover:bg-[#1084d0] p-0.5"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 space-y-1 flex-1 flex flex-col text-xs">
        <div className="flex items-start gap-2">
          {/* Checkbox */}
          <button
            onClick={onComplete}
            disabled={disabled}
            className={cn(
              'w-4 h-4 border-2 border-gray-600 flex items-center justify-center bg-white',
              'shadow-[inset_-1px_-1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(0,0,0,0.3)]'
            )}
          >
            {completed && <Check size={10} />}
          </button>

          {/* Image Placeholder */}
          <div className="w-8 h-8 bg-white border border-gray-400 flex items-center justify-center text-sm">
            🍜
          </div>

          {/* Task Details */}
          <div className="flex-1 space-y-1 min-w-0">
            {description && (
              <p className="text-xs text-gray-600 truncate">{description}</p>
            )}
            {dueDate && (
              <div className="flex items-center gap-1 text-[10px] bg-black text-[#33ff33] font-mono px-1 py-0.5 w-fit">
                <span>DUE: {dueDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        {showNotes && (
          <div className="flex-1 min-h-0">
            <textarea
              value={localNotes}
              onChange={handleNotesChange}
              placeholder="Add notes here..."
              className="w-full h-[60px] resize-none p-1 border border-gray-400 bg-white text-[10px] font-mono"
              disabled={disabled || isSaving}
            />
            {hasUnsavedNotes && (
              <button
                onClick={handleSaveNotes}
                className={cn(
                  "mt-1 w-full text-[10px] py-0.5 px-2 transition-colors",
                  isSaving 
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#000080] text-white hover:bg-[#1084d0]"
                )}
                disabled={disabled || isSaving}
              >
                {isSaving ? "SAVING..." : "SAVE NOTE"}
              </button>
            )}
          </div>
        )}

        {/* Created Date Stamp */}
        <div className="text-[8px] text-gray-500 font-mono">
          Created: {formattedDate} {formattedTime}
        </div>
      </div>
    </div>
  );
} 