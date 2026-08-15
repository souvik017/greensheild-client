import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpDown, Building2, Calendar, FileText, MessageSquare, User } from 'lucide-react';
import { getEnquiryById } from '../../services/api/enquiries';
import { getServiceName, getServiceNames, getAppointmentServiceNames } from '../../utils/serviceName';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { shortId } from '../../utils/formatId';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/Button/Button';
import { EnquiryStatusModal } from '../../components/enquiry/EnquiryStatusModal';
import { ConfirmEnquiryModal } from '../../components/enquiry/ConfirmEnquiryModal';

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

const TimelineItem = ({ event }) => (
  <li className="relative flex gap-4 pb-6 last:pb-0">
    <span className="absolute left-[7px] top-6 h-full w-px bg-border" />
    <span className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-primary-600 bg-surface" />
    <div>
      <StatusBadge status={event.status} label={event.status} />
      <p className="mt-1.5 text-sm leading-6 text-text-secondary">{event.note || ''}</p>
      <p className="mt-1 text-xs text-text-muted">{formatDateTime(event.changedAt)}</p>
    </div>
  </li>
);

export const EnquiryDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);

  const query = useQuery({
    queryKey: ['enquiry', id],
    queryFn: () => getEnquiryById(id),
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
        title={t('admin.enquiryNotFound')}
        description={t('admin.enquiryNotFoundDesc')}
        onRetry={query.refetch}
      />
    );
  }

  const enquiry = query.data.data;
  const appointment = enquiry.appointment;
  const serviceName = getServiceName(enquiry.serviceId, i18n) || enquiry.category || '—';
  const enquiryServiceNames = getServiceNames(enquiry.serviceIds, i18n);
  const servicesList =
    enquiryServiceNames.length > 0 && enquiryServiceNames.join('') !== serviceName
      ? enquiryServiceNames
      : serviceName !== '—'
      ? [serviceName]
      : [];
  const appointmentServices = getAppointmentServiceNames(appointment, i18n);
  const timeline = [...(enquiry.activityLog || [])].reverse();
  const formDataEntries = Object.entries(enquiry.formData || {}).filter(([, value]) => value);

  const ServiceChips = ({ names }) =>
    names.length > 0 ? (
      <div className="flex flex-wrap gap-1.5">
        {names.map((name) => (
          <span
            key={name}
            className="rounded-full border border-border-60 bg-surface-60 px-2.5 py-1 text-xs font-medium text-text-primary"
          >
            {name}
          </span>
        ))}
      </div>
    ) : (
      <span>—</span>
    );

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['enquiry', id] });

  const handleSaved = () => {
    setStatusModalOpen(false);
    refresh();
  };

  const handleConfirm = (values) => {
    setStatusModalOpen(false);
    setConfirmState({ enquiry, ...values });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.backToEnquiries')}
        </Link>
      </div>

      <PageHeader
        eyebrow={t('admin.enquiryId')}
        title={`${enquiry.fullName}`}
        subtitle={`${shortId(enquiry._id)} • ${formatDateTime(enquiry.createdAt)}`}
        actions={
          <>
            <StatusBadge status={enquiry.status} label={t(`status.${enquiry.status}`)} />
            {enquiry.status !== 'confirmed' && (
              <Button variant="outline" leftIcon={<ArrowUpDown className="h-4 w-4" />} onClick={() => setStatusModalOpen(true)}>
                {t('admin.changeStatus')}
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard icon={User} title={t('admin.customerInfo')}>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
            <InfoRow label={t('admin.customerName')} value={enquiry.fullName} />
            <InfoRow label={t('admin.phone')} value={enquiry.phone} />
            <InfoRow label={t('admin.email')} value={enquiry.email} />
            <InfoRow label={t('admin.location')} value={enquiry.location} />
          </div>
        </SectionCard>

        <SectionCard icon={MessageSquare} title={t('admin.enquiryInfo')}>
          <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
            <InfoRow label={t('admin.service')} value={<ServiceChips names={servicesList} />} />
            <InfoRow label={t('admin.category')} value={enquiry.category ? t(`categories.${enquiry.category}`) : '—'} />
            <InfoRow label={t('admin.source')} value={enquiry.source || 'website'} />
            <InfoRow label={t('admin.enquiryDate')} value={formatDateTime(enquiry.createdAt)} />
            <InfoRow label={t('admin.message')} value={enquiry.message} />
          </div>
          {formDataEntries.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {formDataEntries.map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{key}</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Calendar} title={t('admin.followUp')}>
          {enquiry.followUpDate || enquiry.notes ? (
            <div className="divide-y divide-border rounded-2xl border border-border bg-background px-5 py-2">
              <InfoRow label={t('admin.followUpDate')} value={enquiry.followUpDate ? formatDate(enquiry.followUpDate) : '—'} />
              <InfoRow label={t('admin.notes')} value={enquiry.notes} />
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-background px-5 py-6 text-center text-sm text-text-muted">
              {t('admin.noFollowUp')}
            </p>
          )}
        </SectionCard>

        <SectionCard icon={Building2} title={t('admin.appointmentSection')}>
          {appointment ? (
            <div className="rounded-2xl border border-border bg-background px-5 py-3">
              <div className="divide-y divide-border">
                <InfoRow label={t('admin.appointmentId')} value={shortId(appointment._id)} />
                <InfoRow label={t('admin.service')} value={<ServiceChips names={appointmentServices} />} />
                <InfoRow label={t('admin.scheduledDate')} value={formatDate(appointment.scheduledDate)} />
                <InfoRow label={t('admin.scheduledTime')} value={appointment.scheduledTime} />
                <InfoRow
                  label={t('admin.status')}
                  value={<StatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />}
                />
              </div>
              <Link
                to={`/admin/appointments/${appointment._id}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
              >
                <FileText className="h-4 w-4" />
                {t('admin.viewAppointment')}
              </Link>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-background px-5 py-6 text-center text-sm text-text-muted">
              {t('admin.noAppointment')}
            </p>
          )}
        </SectionCard>
      </div>

      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-card">
        <h3 className="text-lg font-semibold text-text-primary">{t('admin.timeline')}</h3>
        {timeline.length > 0 ? (
          <ul className="mt-6">
            {timeline.map((event, index) => (
              <TimelineItem key={`${event.changedAt}-${index}`} event={event} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-text-muted">{t('admin.noTimeline')}</p>
        )}
      </div>

      {enquiry.status !== 'confirmed' && (
        <EnquiryStatusModal
          isOpen={statusModalOpen}
          enquiry={enquiry}
          onClose={() => setStatusModalOpen(false)}
          onSaved={handleSaved}
          onConfirm={handleConfirm}
        />
      )}

      <ConfirmEnquiryModal
        isOpen={!!confirmState}
        enquiry={confirmState?.enquiry}
        defaultFollowUp={confirmState?.followUpDate || ''}
        defaultNotes={confirmState?.notes || ''}
        onClose={() => setConfirmState(null)}
        onConfirmed={() => {
          setConfirmState(null);
          refresh();
        }}
      />
    </div>
  );
};
