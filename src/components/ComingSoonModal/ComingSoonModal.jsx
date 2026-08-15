import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

export const ComingSoonModal = ({ isOpen, onClose, serviceName }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.success(t('enquiry.successMsg'));
    setEmail('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
          <Lock className="h-6 w-6 text-warning" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-primary">
          {serviceName} - {t('coming_soon.title')}
        </h3>
        <p className="mb-6 text-sm text-text-secondary">{t('coming_soon.message')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('coming_soon.notifyPlaceholder')}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20"
            required
          />
          <Button type="submit" fullWidth variant="primary">
            {t('coming_soon.notifyBtn')}
          </Button>
          <Button type="button" fullWidth variant="ghost" onClick={onClose}>
            {t('coming_soon.close')}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
