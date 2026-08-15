import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAppointments, deleteAppointment } from '../../services/api/appointments';
import { getAppointmentServiceNames } from '../../utils/serviceName';
import { formatDate } from '../../utils/formatDate';
import { shortId } from '../../utils/formatId';
import { APPOINTMENT_STATUSES } from '../../utils/constants';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { TableFilterBar } from '../../components/ui/TableFilterBar';
import { MobileCard, MobileCardHeader, MobileCardGrid, MobileCardFooter } from '../../components/ui/MobileCard';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Button } from '../../components/Button/Button';

const getServiceDisplay = (appointment, i18n) => {
  const names = getAppointmentServiceNames(appointment, i18n);
  return names.length > 0 ? names.join(', ') : '—';
};

export const Appointments = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const resetPage = () => setPage(1);

  const query = useQuery({
    queryKey: ['appointments', filter, fromDate, toDate],
    queryFn: () =>
      getAppointments({
        status: filter === 'all' ? undefined : filter,
        dateFrom: fromDate || undefined,
        dateTo: toDate || undefined,
      }),
  });

  const appointments = query.data?.data || [];

  const serviceName = (appointment) => getServiceDisplay(appointment, i18n);
  const customerName = (appointment) =>
    appointment.enquiryId?.fullName || appointment.customerSnapshot?.name || '—';
  const customerPhone = (appointment) =>
    appointment.enquiryId?.phone || appointment.customerSnapshot?.phone || '—';

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await deleteAppointment(deleteTarget._id);
      toast.success(t('admin.appointmentDeleted'));
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.operations')}
        title={t('admin.appointments')}
        subtitle={t('admin.appointmentsSubtitle')}
      />

      <TableFilterBar
        statusOptions={APPOINTMENT_STATUSES}
        statusValue={filter}
        onStatusChange={(value) => {
          setFilter(value);
          resetPage();
        }}
        from={fromDate}
        to={toDate}
        onFromChange={(value) => {
          setFromDate(value);
          resetPage();
        }}
        onToChange={(value) => {
          setToDate(value);
          resetPage();
        }}
        onClear={() => {
          setFilter('all');
          setFromDate('');
          setToDate('');
          resetPage();
        }}
      />

      <DataTable
        columns={[
          { key: 'id', header: t('admin.appointmentId') },
          { key: 'customer', header: t('admin.customer') },
          { key: 'service', header: t('admin.service') },
          { key: 'date', header: t('admin.scheduledDate') },
          { key: 'status', header: t('admin.status') },
          { key: 'actions', header: t('admin.actions') },
        ]}
        rows={appointments}
        renderRow={(appointment) => (
          <tr key={appointment._id} className="transition-colors hover:bg-surface-2/60">
            <td className="px-6 py-4">
              <span className="font-mono text-xs font-medium text-text-muted">{shortId(appointment._id)}</span>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium text-text-primary">{customerName(appointment)}</div>
              <div className="text-sm text-text-secondary">{customerPhone(appointment)}</div>
            </td>
            <td className="px-6 py-4">
              <span className="text-text-primary">{serviceName(appointment)}</span>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-text-primary">{formatDate(appointment.scheduledDate)}</div>
              <div className="text-sm text-text-secondary">{appointment.scheduledTime}</div>
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/appointments/${appointment._id}`}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-500/10"
                >
                  <Eye className="h-4 w-4" />
                  {t('admin.viewDetails')}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(appointment)}
                  aria-label={t('admin.delete')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        )}
        renderCard={(appointment) => (
          <MobileCard key={appointment._id}>
            <MobileCardHeader
              title={customerName(appointment)}
              subtitle={serviceName(appointment)}
              badge={<StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />}
            />
            <MobileCardGrid
              items={[
                { label: t('admin.appointmentId'), value: shortId(appointment._id) },
                { label: t('admin.phone'), value: customerPhone(appointment) },
                { label: t('admin.scheduledDate'), value: formatDate(appointment.scheduledDate) },
                { label: t('admin.scheduledTime'), value: appointment.scheduledTime },
              ]}
            />
            <MobileCardFooter
              left={t('admin.updatedAt')}
              right={
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/appointments/${appointment._id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-700"
                  >
                    <Eye className="h-4 w-4" />
                    {t('admin.viewDetails')}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(appointment)}
                    aria-label={t('admin.delete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              }
            />
          </MobileCard>
        )}
        loading={query.isLoading}
        isEmpty={!query.isLoading && !query.isError && appointments.length === 0}
        emptyIcon={Calendar}
        emptyTitle={t('admin.noAppointments')}
        emptyDescription={t('admin.noAppointmentsDesc')}
        error={query.isError ? t('admin.errorGeneric') : null}
        onRetry={query.refetch}
        colSpan={6}
        paginate
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={(size) => {
          setPageSize(size);
          resetPage();
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('admin.deleteAppointment')}
        message={t('admin.deleteAppointmentConfirm')}
        confirmLabel={t('admin.delete')}
        loading={deletingId === deleteTarget?._id}
      />
    </div>
  );
};