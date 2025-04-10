import React from 'react';
import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTaskDialog({ isOpen, onClose, onConfirm }: DeleteTaskDialogProps) {
  return (
    <Dialog
      title="DELETE TASK"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-center space-y-6">
        <p className="font-vt323 text-xl text-green-500">Are you sure you want to delete this task?</p>
        
        <div className="flex justify-center space-x-4">
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            CANCEL
          </DialogButton>
          <DialogButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            DELETE
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 