import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, UploadCloud, Settings, Trash2, Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/Button/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { LoadingState } from '../../components/ui/LoadingState';
import { DataTable } from '../../components/ui/DataTable';
import { MobileCard, MobileCardHeader, MobileCardGrid, MobileCardFooter } from '../../components/ui/MobileCard';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { BulkUploadModal } from '../../components/service/BulkUploadModal';
import { CATEGORIES, STATUS_COLORS } from '../../utils/constants';
import { getServiceName } from '../../utils/serviceName';
import { getAdminServices, updateServiceStatus, deleteService } from '../../services/api/services';

const SERVICE_STATUSES = ['active', 'inactive', 'comingSoon', 'locked'];

export const ServicesControl = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [updatingId, setUpdatingId] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await getAdminServices();
      setServices(res.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categoryLabel = (categoryId) => {
    const category = CATEGORIES.find((item) => item.id === categoryId);
    return category?.labelKey ? t(category.labelKey) : categoryId;
  };

  const serviceName = (service) => getServiceName(service, i18n);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await deleteService(deleteTarget._id);
      toast.success(t('admin.serviceDeleted'));
      setDeleteTarget(null);
      loadServices();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setDeletingId(null);
    }
  };
  const statusLabel = (service) =>
    service.status === 'active'
      ? t('admin.statusActive')
      : service.status === 'inactive'
      ? t('admin.statusInactive')
      : t(`admin.${service.status}`);

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((service) => {
      if (statusFilter !== 'all' && service.status !== statusFilter) return false;
      if (!q) return true;
      return (
        service.nameEn?.toLowerCase().includes(q) ||
        service.slug?.toLowerCase().includes(q) ||
        getServiceName(service, i18n).toLowerCase().includes(q)
      );
    });
  }, [services, search, statusFilter, i18n.language]);

  const handleStatusChange = async (service, nextStatus) => {
    if (nextStatus === service.status) return;
    setUpdatingId(service._id);
    try {
      await updateServiceStatus(service._id, nextStatus);
      toast.success(t('admin.serviceStatusUpdated'));
      loadServices();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setUpdatingId(null);
    }
  };

  const hasFilter = search.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">{t('admin.catalog')}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary">{t('admin.servicesTitle')}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t('admin.servicesSubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" leftIcon={<UploadCloud className="h-4 w-4" />} onClick={() => setBulkOpen(true)}>
            {t('admin.bulkUpload')}
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/admin/services/new')}>
            {t('admin.addService')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-surface/60 p-4 shadow-card backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={t('admin.searchServices')}
              className="w-full pl-10 lg:w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 shrink-0 text-text-muted" />
            <Select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="w-full sm:w-44"
            >
              <option value="all">{t('admin.allStatus')}</option>
              {SERVICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel({ status })}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setPage(1);
            }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-danger/40 hover:text-danger"
          >
            <X className="h-4 w-4" />
            {t('admin.clearFilter')}
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState label={t('admin.loadingServices')} />
      ) : filteredServices.length === 0 ? (
        <div className="rounded-[32px] border border-border/70 bg-surface/70 p-12 text-center shadow-card backdrop-blur-xl">
          <p className="text-lg font-medium text-text-primary">{t('admin.noServices')}</p>
          <p className="mt-1 text-sm text-text-secondary">{t('admin.noServicesDesc')}</p>
          <Button className="mt-6" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/admin/services/new')}>
            {t('admin.addService')}
          </Button>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: t('admin.serviceName') },
            { key: 'category', header: t('admin.serviceCategory') },
            { key: 'status', header: t('admin.serviceStatus') },
            { key: 'actions', header: t('admin.actions') },
          ]}
          rows={filteredServices}
          paginate
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          pageSizeOptions={[8, 16, 24]}
          onPageSizeChange={setPageSize}
          renderRow={(service) => (
            <tr
              key={service._id}
              className="cursor-pointer transition-colors hover:bg-surface-2/60"
              onClick={() => navigate(`/admin/services/${service._id}`)}
            >
              <td className="px-6 py-4">
                <p className="font-medium text-text-primary">{serviceName(service)}</p>
                <p className="mt-0.5 text-xs text-text-muted">{service.nameEn}</p>
              </td>
              <td className="px-6 py-4 text-text-secondary">{categoryLabel(service.category)}</td>
              <td className="px-6 py-4">
                <div className="inline-flex" onClick={(event) => event.stopPropagation()}>
                  <select
                    value={service.status}
                    disabled={updatingId === service._id}
                    onChange={(event) => handleStatusChange(service, event.target.value)}
                    className={`cursor-pointer appearance-none rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-opacity disabled:opacity-60 ${
                      STATUS_COLORS[service.status] || STATUS_COLORS.inactive
                    }`}
                    title={t('admin.changeStatus')}
                  >
                    {SERVICE_STATUSES.map((status) => (
                      <option key={status} value={status} className="bg-surface text-text-primary">
                        {statusLabel({ status })}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/admin/services/${service._id}`);
                    }}
                  >
                    {t('admin.viewDetails')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t('admin.delete')}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteTarget(service);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          )}
          renderCard={(service) => (
            <MobileCard key={service._id}>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => navigate(`/admin/services/${service._id}`)}
              >
                <MobileCardHeader
                  title={serviceName(service)}
                  subtitle={service.nameEn}
                  badge={
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COLORS[service.status] || STATUS_COLORS.inactive
                      }`}
                    >
                      {statusLabel(service)}
                    </span>
                  }
                />
                <MobileCardGrid
                  items={[{ label: t('admin.serviceCategory'), value: categoryLabel(service.category) }]}
                />
              </button>
              <MobileCardFooter
                left={service.slug}
                right={
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
                      <Settings className="h-4 w-4" />
                      {t('admin.viewDetails')}
                    </span>
                    <Button variant="ghost" size="sm" aria-label={t('admin.delete')} onClick={() => setDeleteTarget(service)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                }
              />
            </MobileCard>
          )}
          loading={loading}
          isEmpty={!loading && services.length === 0}
          emptyIcon={Settings}
          emptyTitle={t('admin.noServices')}
          emptyDescription={t('admin.noServicesDesc')}
          colSpan={4}
        />
      )}

      <BulkUploadModal isOpen={bulkOpen} onClose={() => setBulkOpen(false)} onUploaded={loadServices} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('admin.deleteService')}
        message={t('admin.deleteServiceConfirm')}
        confirmLabel={t('admin.delete')}
        loading={deletingId === deleteTarget?._id}
      />
    </div>
  );
};