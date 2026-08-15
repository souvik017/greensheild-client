import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpDown, Building2, Calendar, CalendarClock, FileText, MessageSquare, Plus, User } from 'lucide-react';
import { getAppointmentById } from '../../services/api/appointments';
import { getServiceName } from '../../utils/serviceName';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { shortId } from '../../utils/formatId';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/Button/Button';
import { AppointmentStatusModal } from '../../components/appointment/AppointmentStatusModal';
import { RescheduleModal } from '../../components/appointment/RescheduleModal';
import { InvoiceCreateModal } from '../../components/invoice/InvoiceCreateModal';
import { InvoicePreviewModal } from '../../components/invoice/InvoicePreviewModal';

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="rounded-[28px] border border-border bg-surface p-6 shadow-card">
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
    </div>
    <div className="mt-5">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-start sm:gap-4">
    <span className="w-32 shrink-0 text-sm font-medium text-text-muted">{label}</span>
    <span className="text-sm text-text-primary">{value || '—'}</span>
  </div>
);

export const AppointmentDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const query = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id),
    retry: false,
  });

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState rows={4} />
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <ErrorState
        title={t('admin.appointmentNotFound')}
        description={t('admin.appointmentNotFoundDesc')}
        onRetry={query.refetch}
      />
    );
  }

  const appointment = query.data.data;
  const enquiry = appointment.enquiryId;
  const serviceEntries =
    Array.isArray(appointment.serviceIds) && appointment.serviceIds.length > 0
      ? appointment.serviceIds
      : appointment.serviceId
      ? [appointment.serviceId]
      : Array.isArray(appointment.serviceSnapshot) && appointment.serviceSnapshot.length > 0
      ? appointment.serviceSnapshot
      : appointment.enquiryId?.category
      ? [{ category: appointment.enquiryId.category, nameEn: appointment.enquiryId.category }]
      : [];
  const invoices = appointment.invoices || [];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['appointment', id] });

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/appointments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.backToAppointments')}
        </Link>
      </div>

      <PageHeader
        eyebrow={t('admin.appointmentId')}
        title={enquiry?.fullName || appointment.customerSnapshot?.name || ''}
        subtitle={`${shortId(appointment._id)} • ${formatDateTime(appointment.createdAt)}`}
        actions={
          <>
            <StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />
            <Button variant="outline" leftIcon={<CalendarClock className="h-4 w-4" />} onClick={() => setRescheduleOpen(true)}>
              {t('admin.reschedule')}
            </Button>
            <Button variant="outline" leftIcon={<ArrowUpDown className="h-4 w-4" />} onClick={() => setStatusModalOpen(true)}>
              {t('admin.changeStatus')}
            </Button>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setInvoiceCreateOpen(true)}>
              {t('admin.generateInvoice')}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard icon={Calendar} title={t('admin.appointmentInfo')}>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
            <InfoRow label={t('admin.scheduledDate')} value={formatDate(appointment.scheduledDate)} />
            <InfoRow label={t('admin.scheduledTime')} value={appointment.scheduledTime} />
            <InfoRow label={t('admin.status')} value={<StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />} />
            <InfoRow label={t('admin.createdAt')} value={formatDateTime(appointment.createdAt)} />
            <InfoRow label={t('admin.notes')} value={appointment.notes} />
          </div>
        </SectionCard>

        <SectionCard icon={User} title={t('admin.customerInfo')}>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
            <InfoRow label={t('admin.customerName')} value={enquiry?.fullName || appointment.customerSnapshot?.name} />
            <InfoRow label={t('admin.phone')} value={enquiry?.phone || appointment.customerSnapshot?.phone} />
            <InfoRow label={t('admin.email')} value={enquiry?.email} />
            <InfoRow label={t('admin.location')} value={enquiry?.location || appointment.customerSnapshot?.location} />
          </div>
        </SectionCard>

        <SectionCard icon={Building2} title={t('admin.serviceInfo')}>
          {serviceEntries.length > 0 ? (
            <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
              {serviceEntries.map((service) => (
                <div key={service._id || service.nameEn} className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {getServiceName(service, i18n) || service.category || '—'}
                    </span>
                    {service.category && (
                      <span className="rounded-full bg-primary-10 px-2.5 py-0.5 text-[11px] font-medium text-primary-700">
                        {t(`categories.${service.category}`)}
                      </span>
                    )}
                  </div>
                  {(service.longDescription || service.shortDescription) && (
                    <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                      {service.longDescription || service.shortDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-background px-5 py-6 text-center text-sm text-text-muted">
              {t('admin.noServices') || '—'}
            </p>
          )}
        </SectionCard>

        <SectionCard icon={MessageSquare} title={t('admin.enquiryInfo')}>
          {enquiry ? (
            <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
              <InfoRow
                label={t('admin.enquiryId')}
                value={
                  <Link
                    to={`/admin/enquiries/${enquiry._id}`}
                    className="font-medium text-primary-700 hover:text-primary-800"
                  >
                    {shortId(enquiry._id)}
                  </Link>
                }
              />
              <InfoRow label={t('admin.enquiryDate')} value={formatDateTime(enquiry.createdAt)} />
              <InfoRow label={t('admin.enquiryStatus')} value={<StatusBadge status={enquiry.status} label={t(`status.${enquiry.status}`)} />} />
              <InfoRow label={t('admin.followUpDate')} value={enquiry.followUpDate ? formatDate(enquiry.followUpDate) : '—'} />
              <InfoRow label={t('admin.notes')} value={enquiry.notes} />
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-background px-5 py-6 text-center text-sm text-text-muted">
              {t('admin.noEnquiryReference')}
            </p>
          )}
        </SectionCard>
      </div>

      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{t('admin.invoices')}</h3>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setInvoiceCreateOpen(true)}>
            {t('admin.newInvoice')}
          </Button>
        </div>

        {invoices.length > 0 ? (
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-background">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-text-primary">{invoice.invoiceNumber}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{formatDateTime(invoice.generatedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={invoice.status} label={t(`status.${invoice.status}`)} />
                  <span className="text-sm font-semibold text-text-primary">
                    ₹{Number(invoice.totalAmount).toLocaleString('en-IN')}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPreviewInvoice(invoice)}>
                    {t('admin.viewInvoice')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={FileText}
              title={t('admin.noInvoices')}
              description={t('admin.noInvoicesDesc')}
              action={
                <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setInvoiceCreateOpen(true)}>
                  {t('admin.generateInvoice')}
                </Button>
              }
            />
          </div>
        )}
      </div>

      <AppointmentStatusModal
        isOpen={statusModalOpen}
        appointment={appointment}
        onClose={() => setStatusModalOpen(false)}
        onSaved={refresh}
      />

      <RescheduleModal
        isOpen={rescheduleOpen}
        appointment={appointment}
        onClose={() => setRescheduleOpen(false)}
        onSaved={refresh}
      />

      <InvoiceCreateModal
        isOpen={invoiceCreateOpen}
        appointment={appointment}
        onClose={() => setInvoiceCreateOpen(false)}
        onCreated={(invoice) => {
          refresh();
          setPreviewInvoice(invoice);
        }}
      />

      <InvoicePreviewModal isOpen={!!previewInvoice} invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />
    </div>
  );
};
