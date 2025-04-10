import React, { useState, useEffect } from 'react';
import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialText: string;
}

export function EditTaskDialog({ isOpen, onClose, onSave, initialText }: EditTaskDialogProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      onClose();
    }
  };

  return (
    <Dialog
      title="EDIT TASK"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 bg-black text-white font-vt323 text-lg border-2 border-blue-500"
          placeholder="Edit task..."
          autoFocus
        />
        
        <div className="flex justify-end space-x-4">
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            CANCEL
          </DialogButton>
          <DialogButton
            onClick={handleSave}
            disabled={!text.trim()}
          >
            SAVE
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 