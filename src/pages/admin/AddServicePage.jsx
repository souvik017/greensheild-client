import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/Button/Button';
import { ServiceForm } from '../../components/service/ServiceForm';
import { createService } from '../../services/api/services';

export const AddServicePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await createService(data);
      toast.success(t('admin.serviceCreated'));
      navigate(`/admin/services/${res.data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/services')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.backToServices')}
        </button>
        <PageHeader
          eyebrow={t('admin.catalog')}
          title={t('admin.addService')}
          subtitle={t('admin.addServiceDesc')}
          actions={
            <Button variant="outline" onClick={() => navigate('/admin/services')}>
              {t('admin.cancel')}
            </Button>
          }
        />
      </div>

      <div className="rounded-[32px] border border-border bg-surface p-8 shadow-card">
        <ServiceForm onSubmit={handleSubmit} submitLabel={t('admin.createService')} isSubmitting={submitting} />
      </div>
    </div>
  );
};
