import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-14 h-14 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-danger-500" />
        </div>
        <p className="text-surface-600 dark:text-surface-400 mb-6">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
