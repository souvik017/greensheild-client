import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Layers, Pencil, X } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/Button/Button';
import { ServiceForm } from '../../components/service/ServiceForm';
import { getServiceById, updateService } from '../../services/api/services';
import { getServiceName } from '../../utils/serviceName';
import { CATEGORIES, STATUS_COLORS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';

const DetailCard = ({ label, value }) => (
  <div className="rounded-2xl border border-border bg-background px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
    <p className="mt-1 text-sm text-text-primary">{value || '—'}</p>
  </div>
);

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const query = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id),
    retry: false,
  });

  const service = query.data?.data;

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateService(id, data);
      toast.success(t('admin.serviceUpdated'));
      queryClient.invalidateQueries({ queryKey: ['service', id] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
      setSubmitting(false);
    }
  };

  if (query.isLoading) return <LoadingState />;
  if (query.isError || !service)
    return <ErrorState message={t('admin.serviceNotFound')} onRetry={() => query.refetch()} />;

  const category = CATEGORIES.find((item) => item.id === service.category);

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
          title={getServiceName(service, i18n)}
          actions={
            editing ? (
              <Button variant="outline" leftIcon={<X className="h-4 w-4" />} onClick={() => setEditing(false)}>
                {t('admin.cancel')}
              </Button>
            ) : (
              <Button leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(true)}>
                {t('admin.editService')}
              </Button>
            )
          }
        />
      </div>

      {editing ? (
        <div className="rounded-[32px] border border-border bg-surface p-8 shadow-card">
          <ServiceForm
            initialValues={{
              nameEn: service.nameEn,
              nameBn: service.nameBn,
              nameHi: service.nameHi,
              description: service.description || service.shortDescription,
              category: service.category,
              status: service.status === 'inactive' ? 'inactive' : 'active',
              icon: service.icon || 'Box',
              image: service.image || '',
            }}
            onSubmit={handleSubmit}
            submitLabel={t('admin.saveService')}
            isSubmitting={submitting}
          />
        </div>
      ) : (
        <>
          {service.image && (
            <div className="overflow-hidden rounded-[32px] border border-border shadow-card">
              <img src={service.image} alt={getServiceName(service, i18n)} className="max-h-72 w-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard label={t('admin.serviceCategory')} value={category ? t(category.labelKey) : service.category} />
            <DetailCard
              label={t('admin.serviceStatus')}
              value={
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[service.status] || STATUS_COLORS.inactive}`}>
                  {service.status}
                </span>
              }
            />
            <DetailCard label={t('admin.slug')} value={service.slug} />
            <DetailCard label={t('admin.updatedAt')} value={formatDateTime(service.updatedAt)} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-card">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{t('admin.description')}</h3>
              </div>
              <p className="mt-5 text-sm leading-7 text-text-secondary">{service.description || service.shortDescription || '—'}</p>
            </div>

            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-card">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{t('admin.localizedNames')}</h3>
              </div>
              <div className="mt-5 space-y-3 text-sm text-text-secondary">
                <p><span className="font-medium text-text-primary">English:</span> {service.nameEn || '—'}</p>
                <p><span className="font-medium text-text-primary">বাংলা:</span> {service.nameBn || '—'}</p>
                <p><span className="font-medium text-text-primary">हिन्दी:</span> {service.nameHi || '—'}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
