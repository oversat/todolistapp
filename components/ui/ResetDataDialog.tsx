import React, { useState } from 'react';
import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface ResetDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDataDialog({ isOpen, onClose, onConfirm }: ResetDataDialogProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (passcode === 'lemongrass') {
      onConfirm();
      onClose();
    } else {
      setError('Incorrect passcode');
    }
  };

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
        <p className="font-vt323">Enter passcode to continue:</p>
        
        <input
          type="password"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setError('');
          }}
          className="w-full px-3 py-2 bg-black text-white font-vt323 text-lg border-2 border-blue-500"
          placeholder="Enter passcode..."
        />
        
        {error && (
          <p className="font-vt323 text-red-500">{error}</p>
        )}
        
        <div className="flex justify-center space-x-4">
          <DialogButton
            variant="danger"
            onClick={handleConfirm}
          >
            RESET ALL
          </DialogButton>
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            CANCEL
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 