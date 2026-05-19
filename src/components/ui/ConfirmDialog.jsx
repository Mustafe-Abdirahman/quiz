import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <FiAlertTriangle size={24} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}