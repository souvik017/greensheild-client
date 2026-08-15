import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowUpDown, MessageSquare, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEnquiries, deleteEnquiry } from '../../services/api/enquiries';
import { getServiceName, getServiceNamesLabel } from '../../utils/serviceName';
import { formatDate } from '../../utils/formatDate';
import { shortId } from '../../utils/formatId';
import { ENQUIRY_STATUSES } from '../../utils/constants';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { TableFilterBar } from '../../components/ui/TableFilterBar';
import { MobileCard, MobileCardHeader, MobileCardGrid, MobileCardFooter } from '../../components/ui/MobileCard';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Button } from '../../components/Button/Button';
import { CreateEnquiryModal } from '../../components/enquiry/CreateEnquiryModal';
import { EnquiryStatusModal } from '../../components/enquiry/EnquiryStatusModal';
import { ConfirmEnquiryModal } from '../../components/enquiry/ConfirmEnquiryModal';

const PAGE_SIZE = 10;

const getServiceDisplay = (enquiry, i18n) =>
  getServiceNamesLabel(enquiry.serviceIds || [], i18n) ||
  getServiceName(enquiry.serviceId, i18n) ||
  enquiry.category ||
  '—';

export const Enquiries = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [statusModalEnquiry, setStatusModalEnquiry] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const query = useQuery({
    queryKey: ['enquiries', filter, fromDate, toDate, page, pageSize],
    queryFn: () =>
      getEnquiries({
        status: filter === 'all' ? undefined : filter,
        dateFrom: fromDate || undefined,
        dateTo: toDate || undefined,
        page,
        limit: pageSize,
      }),
  });

  const enquiries = query.data?.data || [];
  const pagination = query.data?.pagination;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['enquiries'] });
  };

  const openStatusModal = (enquiry) => {
    if (enquiry.status === 'confirmed') {
      navigate(`/admin/enquiries/${enquiry._id}`);
      return;
    }
    setStatusModalEnquiry(enquiry);
  };

  const handleStatusSaved = () => {
    setStatusModalEnquiry(null);
    refresh();
  };

  const handleStatusConfirm = (enquiry, values) => {
    setStatusModalEnquiry(null);
    setConfirmState({ enquiry, ...values });
  };

  const serviceName = (enquiry) => getServiceDisplay(enquiry, i18n);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await deleteEnquiry(deleteTarget._id);
      toast.success(t('admin.enquiryDeleted'));
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.workspace')}
        title={t('admin.enquiries')}
        subtitle={t('admin.enquiriesSubtitle')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            {t('admin.createEnquiry')}
          </Button>
        }
      />

      <TableFilterBar
        statusOptions={ENQUIRY_STATUSES}
        statusValue={filter}
        onStatusChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        from={fromDate}
        to={toDate}
        onFromChange={(value) => {
          setFromDate(value);
          setPage(1);
        }}
        onToChange={(value) => {
          setToDate(value);
          setPage(1);
        }}
        onClear={() => {
          setFilter('all');
          setFromDate('');
          setToDate('');
          setPage(1);
        }}
      />

      <DataTable
        columns={[
          { key: 'id', header: t('admin.enquiryId') },
          { key: 'customer', header: t('admin.customer') },
          { key: 'contact', header: t('admin.contact') },
          { key: 'service', header: t('admin.service') },
          { key: 'date', header: t('admin.enquiryDate') },
          { key: 'status', header: t('admin.status') },
          { key: 'followUp', header: t('admin.followUp') },
          { key: 'actions', header: t('admin.actions') },
        ]}
        rows={enquiries}
        renderRow={(enquiry) => (
          <tr key={enquiry._id} className="transition-colors hover:bg-surface-2/60">
            <td className="px-6 py-4">
              <span className="font-mono text-xs font-medium text-text-muted">{shortId(enquiry._id)}</span>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium text-text-primary">{enquiry.fullName}</div>
              <div className="text-sm text-text-secondary">{enquiry.location}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-text-primary">{enquiry.phone}</div>
              <div className="text-sm text-text-secondary">{enquiry.email || '—'}</div>
            </td>
            <td className="px-6 py-4">
              <span className="text-text-primary">{serviceName(enquiry)}</span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
              {formatDate(enquiry.createdAt)}
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={enquiry.status} label={t(`status.${enquiry.status}`)} />
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
              {enquiry.followUpDate ? formatDate(enquiry.followUpDate) : '—'}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-1">
                <Link
                  to={`/admin/enquiries/${enquiry._id}`}
                  aria-label={t('admin.viewDetails')}
                  title={t('admin.viewDetails')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-primary-500/10 hover:text-primary-700"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Button variant="ghost" size="sm" className="h-9 w-9 !px-0" onClick={() => openStatusModal(enquiry)} aria-label={t('admin.changeStatus')} title={t('admin.changeStatus')}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 !px-0" onClick={() => setDeleteTarget(enquiry)} aria-label={t('admin.delete')} title={t('admin.delete')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        )}
        renderCard={(enquiry) => (
          <MobileCard key={enquiry._id}>
            <MobileCardHeader
              title={enquiry.fullName}
              subtitle={enquiry.location}
              badge={<StatusBadge status={enquiry.status} label={t(`status.${enquiry.status}`)} />}
            />
            <MobileCardGrid
              items={[
                { label: t('admin.enquiryId'), value: shortId(enquiry._id) },
                { label: t('admin.phone'), value: enquiry.phone },
                { label: t('admin.service'), value: serviceName(enquiry) },
                { label: t('admin.enquiryDate'), value: formatDate(enquiry.createdAt) },
                { label: t('admin.followUp'), value: enquiry.followUpDate ? formatDate(enquiry.followUpDate) : '—' },
                { label: t('admin.email'), value: enquiry.email || '—' },
              ]}
            />
            <MobileCardFooter
              left={t('admin.source') + ': ' + enquiry.source}
              right={
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/enquiries/${enquiry._id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-700"
                  >
                    <Eye className="h-4 w-4" />
                    {t('admin.viewDetails')}
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(enquiry)} aria-label={t('admin.delete')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              }
            />
          </MobileCard>
        )}
        loading={query.isLoading}
        isEmpty={!query.isLoading && !query.isError && enquiries.length === 0}
        emptyIcon={MessageSquare}
        emptyTitle={t('admin.noEnquiries')}
        emptyDescription={t('admin.noEnquiriesDesc')}
        error={query.isError ? t('admin.errorGeneric') : null}
        onRetry={query.refetch}
        colSpan={8}
        paginate
        serverSide
        page={pagination?.page || 1}
        totalPages={pagination?.pages || 1}
        total={pagination?.total}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <CreateEnquiryModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreated={refresh} />

      {statusModalEnquiry && (
        <EnquiryStatusModal
          isOpen={!!statusModalEnquiry}
          enquiry={statusModalEnquiry}
          onClose={() => setStatusModalEnquiry(null)}
          onSaved={handleStatusSaved}
          onConfirm={handleStatusConfirm}
        />
      )}

      {confirmState && (
        <ConfirmEnquiryModal
          isOpen={!!confirmState}
          enquiry={confirmState.enquiry}
          defaultFollowUp={confirmState.followUpDate || ''}
          defaultNotes={confirmState.notes || ''}
          onClose={() => setConfirmState(null)}
          onConfirmed={() => {
            setConfirmState(null);
            refresh();
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('admin.deleteEnquiry')}
        message={t('admin.deleteEnquiryConfirm')}
        confirmLabel={t('admin.delete')}
        loading={deletingId === deleteTarget?._id}
      />
    </div>
  );
};