import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Copy, UploadCloud } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Field, Textarea } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { bulkCreateServices } from '../../services/api/services';

const DEMO_JSON = `[
  {
    "nameEn": "AC Service & Repair",
    "nameBn": "এসি সার্ভিস ও মেরামত",
    "nameHi": "एसी सर्विस और मरम्मत",
    "description": "Professional AC servicing, gas refill and repair at your doorstep.",
    "category": "electrical-electronics",
    "status": "active",
    "icon": "Wind"
  },
  {
    "nameEn": "Deep Home Cleaning",
    "nameBn": "গভীর ঘর পরিষ্কার",
    "nameHi": "गहरी घर सफाई",
    "description": "Complete deep cleaning for sofas, carpets and every corner of your home.",
    "category": "cleaning",
    "status": "active",
    "icon": "Sparkles"
  }
]`;

export const BulkUploadModal = ({ isOpen, onClose, onUploaded }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_JSON);
      toast.success(t('admin.copied'));
    } catch {
      toast.error(t('admin.errorGeneric'));
    }
  };

  const handleSubmit = async () => {
    setError('');
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch {
      setError(t('admin.bulkUploadInvalidJson'));
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      setError(t('admin.bulkUploadInvalidJson'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await bulkCreateServices(parsed);
      const { created = [], errors = [] } = res.data || {};
      if (created.length > 0) {
        toast.success(`${t('admin.servicesUploaded')}: ${created.length}`);
      }
      setResult({ created: created.length, errors });
      onUploaded?.();
      if (errors.length === 0) {
        setValue('');
        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.bulkUploadServices')} size="xl">
      <div className="space-y-5">
        <div className="flex items-start gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-secondary">
          <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
          <div>
            <p>{t('admin.bulkUploadDesc')}</p>
            <p className="mt-1 text-xs text-text-muted">{t('admin.bulkUploadHint')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-text-primary">{t('admin.demoFormat')}</p>
          <Button variant="outline" size="sm" leftIcon={<Copy className="h-4 w-4" />} onClick={handleCopy}>
            {t('admin.copyDemoFormat')}
          </Button>
        </div>

        <pre className="max-h-48 overflow-auto rounded-2xl border border-border bg-background p-4 text-xs leading-5 text-text-secondary">
          {DEMO_JSON}
        </pre>

        <Field label="JSON" required error={error}>
          <Textarea
            rows={8}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError('');
            }}
            placeholder="[{ ... }]"
            error={!!error}
            className="font-mono text-xs"
          />
        </Field>

        {result && result.errors.length > 0 && (
          <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3">
            <p className="text-sm font-medium text-danger">{t('admin.bulkErrors')}</p>
            <ul className="mt-2 space-y-1 text-xs text-text-secondary">
              {result.errors.map((err, index) => (
                <li key={index}>
                  {err.nameEn || '?'}: {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit} loading={submitting}>
            {t('admin.bulkUpload')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
