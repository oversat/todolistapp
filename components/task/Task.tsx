import React, { useState } from 'react';
import { Check, Edit2, Trash2, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProps {
  id: string;
  text: string;
  completed?: boolean;
  disabled?: boolean;
  notes?: string;
  due_date?: string;
  created_at: string;
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
  const createdDate = new Date(created_at).toLocaleDateString();
  const createdTime = new Date(created_at).toLocaleTimeString([], { 
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDueDate(e.target.value);
  };

  const handleSaveDueDate = async () => {
    if (!onDueDateChange) return;
    setIsSavingDate(true);
    try {
      await onDueDateChange(localDueDate);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error saving due date:', error);
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
                className="text-white hover:bg-[#1084d0] p-0.5"
                title="Set Due Date"
              >
                <Clock size={10} />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-white hover:bg-[#1084d0] p-0.5"
                title={showNotes ? "Hide Notes" : "Show Notes"}
              >
                <MessageSquare size={10} />
              </button>
            </>
          )}
          {!disabled && onEdit && (
            <button
              onClick={onEdit}
              className="text-white hover:bg-[#1084d0] p-0.5"
            >
              <Edit2 size={10} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-white hover:bg-[#1084d0] p-0.5"
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
            onClick={onComplete}
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
              <div className="absolute left-0 right-0 bg-gray-200 border border-gray-400 p-2 shadow-lg z-[40]">
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
    </div>
  );
} 