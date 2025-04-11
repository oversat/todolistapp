import { Dialog, DialogButton } from '@/components/ui/Dialog';

interface DeleteChibiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chibiName: string;
}

export function DeleteChibiDialog({
  isOpen,
  onClose,
  onConfirm,
  chibiName,
}: DeleteChibiDialogProps) {
  return (
    <Dialog
      title="DELETE CHIBI"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-center space-y-6">
        <p className="font-vt323 text-xl text-green-500">
          Are you REALLY sure you want to delete this cute chibi checklist? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <DialogButton
            variant="secondary"
            onClick={onClose}
          >
            CANCEL
          </DialogButton>
          <DialogButton
            variant="danger"
            onClick={onConfirm}
          >
            DELETE
          </DialogButton>
        </div>
      </div>
    </Dialog>
  );
} 