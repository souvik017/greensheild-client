import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Eye, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInvoices, deleteInvoice } from '../../services/api/invoices';
import { formatDateTime } from '../../utils/formatDate';
import { shortId } from '../../utils/formatId';
import { INVOICE_STATUSES } from '../../utils/constants';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { TableFilterBar } from '../../components/ui/TableFilterBar';
import { MobileCard, MobileCardHeader, MobileCardGrid, MobileCardFooter } from '../../components/ui/MobileCard';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Button } from '../../components/Button/Button';
import { InvoicePreviewModal } from '../../components/invoice/InvoicePreviewModal';

const formatAmount = (invoice) =>
  `₹${Number(invoice.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const Invoices = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const resetPage = () => setPage(1);

  const query = useQuery({
    queryKey: ['invoices', filter, fromDate, toDate],
    queryFn: () =>
      getInvoices({
        status: filter === 'all' ? undefined : filter,
        dateFrom: fromDate || undefined,
        dateTo: toDate || undefined,
      }),
  });

  const invoices = query.data?.data || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await deleteInvoice(deleteTarget._id);
      toast.success(t('admin.invoiceDeleted'));
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.finance')}
        title={t('admin.invoices')}
        subtitle={t('admin.invoicesSubtitle')}
      />

      <TableFilterBar
        statusOptions={INVOICE_STATUSES}
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
          { key: 'number', header: t('admin.invoiceNumber') },
          { key: 'customer', header: t('admin.customer') },
          { key: 'appointment', header: t('admin.appointmentId') },
          { key: 'amount', header: t('admin.amount') },
          { key: 'date', header: t('admin.invoiceDate') },
          { key: 'status', header: t('admin.status') },
          { key: 'actions', header: t('admin.actions') },
        ]}
        rows={invoices}
        renderRow={(invoice) => (
          <tr key={invoice._id} className="transition-colors hover:bg-surface-2/60">
            <td className="px-6 py-4">
              <span className="font-mono text-sm font-semibold text-text-primary">{invoice.invoiceNumber}</span>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium text-text-primary">{invoice.customerSnapshot?.name || '—'}</div>
              <div className="text-sm text-text-secondary">{invoice.customerSnapshot?.phone || ''}</div>
            </td>
            <td className="px-6 py-4">
              <span className="font-mono text-xs font-medium text-text-muted">{shortId(invoice.appointmentId)}</span>
            </td>
            <td className="px-6 py-4 font-semibold text-text-primary">{formatAmount(invoice)}</td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
              {formatDateTime(invoice.generatedAt)}
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={invoice.status} label={t(`status.${invoice.status}`)} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => setPreviewInvoice(invoice)}
                >
                  {t('admin.viewInvoice')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(invoice)} aria-label={t('admin.delete')}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        )}
        renderCard={(invoice) => (
          <MobileCard key={invoice._id}>
            <MobileCardHeader
              title={invoice.invoiceNumber}
              subtitle={invoice.customerSnapshot?.name || '—'}
              badge={<StatusBadge status={invoice.status} label={t(`status.${invoice.status}`)} />}
            />
            <MobileCardGrid
              items={[
                { label: t('admin.amount'), value: formatAmount(invoice) },
                { label: t('admin.invoiceDate'), value: formatDateTime(invoice.generatedAt) },
                { label: t('admin.appointmentId'), value: shortId(invoice.appointmentId) },
              ]}
            />
            <MobileCardFooter
              left={invoice.customerSnapshot?.phone || ''}
              right={
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />} onClick={() => setPreviewInvoice(invoice)}>
                    {t('admin.viewInvoice')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(invoice)} aria-label={t('admin.delete')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              }
            />
          </MobileCard>
        )}
        loading={query.isLoading}
        isEmpty={!query.isLoading && !query.isError && invoices.length === 0}
        emptyIcon={FileText}
        emptyTitle={t('admin.noInvoices')}
        emptyDescription={t('admin.noInvoicesDesc')}
        error={query.isError ? t('admin.errorGeneric') : null}
        onRetry={query.refetch}
        colSpan={7}
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

      <InvoicePreviewModal isOpen={!!previewInvoice} invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('admin.deleteInvoice')}
        message={t('admin.deleteInvoiceConfirm')}
        confirmLabel={t('admin.delete')}
        loading={deletingId === deleteTarget?._id}
      />
    </div>
  );
};