import React from 'react';
import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface FeedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFeed: () => void;
}

export function FeedDialog({ isOpen, onClose, onFeed }: FeedDialogProps) {
  return (
    <Dialog
      title="CHIBI HUNGRY!"
      isOpen={isOpen}
      onClose={onClose}
      className="animate-bounce-gentle"
    >
      <div className="text-center space-y-6">
        <p className="font-vt323 text-xl text-green-500">Task completed! Feed your Chibi?</p>
        
        <div className="flex justify-center space-x-4">
          <DialogButton
            onClick={() => {
              onFeed();
              onClose();
            }}
          >
            YES
          </DialogButton>
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            NO
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 