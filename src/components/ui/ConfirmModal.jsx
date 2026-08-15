import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  danger = true,
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t('admin.confirmAction')} size="sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm leading-6 text-text-secondary">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t('admin.cancel')}
        </Button>
        <Button type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel || t('admin.confirm')}
        </Button>
      </div>
    </Modal>
  );
};
