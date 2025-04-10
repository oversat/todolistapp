import React from 'react';
import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface ResetDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDataDialog({ isOpen, onClose, onConfirm }: ResetDataDialogProps) {
  return (
    <Dialog
      title="WARNING!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-center space-y-6">
        <p className="font-vt323 text-xl text-red-500">
          This will delete all Chibis and tasks.
        </p>
        <p className="font-vt323">Are you sure you want to continue?</p>
        
        <div className="flex justify-center space-x-4">
          <DialogButton
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            YES, RESET ALL
          </DialogButton>
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            NO, KEEP DATA
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 