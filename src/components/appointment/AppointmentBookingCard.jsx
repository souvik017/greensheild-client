import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, MessageSquare, Phone } from 'lucide-react';
import { getAppointmentServiceNames } from '../../utils/serviceName';
import { shortId } from '../../utils/formatId';

const STATUS_CHIP = {
  scheduled: 'border border-primary-20 bg-primary-10 text-primary-700',
  'in-progress': 'border border-accent-100 bg-accent-50 text-accent-600',
  completed: 'border border-success-25 bg-success-10 text-success',
  'no-show': 'border border-danger-25 bg-danger-10 text-danger',
  cancelled: 'border border-danger-25 bg-danger-10 text-danger',
};

const StatusChip = ({ status, label }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${
      STATUS_CHIP[status] || 'border border-border bg-surface-2 text-text-muted'
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {label}
  </span>
);

const ArrowButton = () => (
  <span
    aria-hidden="true"
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-70 bg-surface-2/60 text-text-muted transition-all duration-200 group-hover:border-primary-200 group-hover:bg-primary-10 group-hover:text-primary-700 group-active:scale-95"
  >
    <ChevronRight className="h-4 w-4" />
  </span>
);

const TimeBlock = ({ time }) => {
  const [clock = '—', meridiem] = (time || '').trim().split(/\s+/);
  return (
    <div className="flex h-16 w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/70 bg-surface-2/60">
      <Clock className="h-4 w-4 text-primary-600" strokeWidth={2.2} />
      <div className="flex items-baseline gap-0.5 leading-none">
        <span className="font-display text-sm font-bold tracking-tight text-text-primary">{clock}</span>
        {meridiem && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{meridiem}</span>
        )}
      </div>
    </div>
  );
};

export const AppointmentBookingCard = ({ appointment }) => {
  const { t, i18n } = useTranslation();

  const customerName = appointment.enquiryId?.fullName || appointment.customerSnapshot?.name || '—';
  const phone = appointment.enquiryId?.phone || appointment.customerSnapshot?.phone || '';
  const servicesLabel = getAppointmentServiceNames(appointment, i18n).join(', ') || '—';
  const statusLabel = t(`status.${appointment.status}`);

  return (
    <Link
      to={`/admin/appointments/${appointment._id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border/70 bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200/70 hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12)] sm:p-5 md:flex-row md:items-center md:gap-6 md:p-6"
    >
      <div className="flex items-center justify-between gap-3 md:hidden">
        <span className="flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-text-primary">
          <Clock className="h-4 w-4 text-primary-600" strokeWidth={2.2} />
          {appointment.scheduledTime || '—'}
        </span>
        <StatusChip status={appointment.status} label={statusLabel} />
      </div>

      <div className="hidden md:block">
        <TimeBlock time={appointment.scheduledTime} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-semibold tracking-tight text-text-primary">
          {customerName}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-primary-700">{servicesLabel}</p>

        {appointment.notes ? (
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-text-muted">
            <MessageSquare className="mt-px h-3.5 w-3.5 shrink-0" />
            <span className="italic">{appointment.notes}</span>
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <span className="font-mono text-[11px] tracking-tight">{shortId(appointment._id)}</span>
            {phone && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-border" />
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </span>
            )}
          </div>
          <span className="shrink-0 md:hidden">
            <ArrowButton />
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-4 md:flex">
        <StatusChip status={appointment.status} label={statusLabel} />
        <ArrowButton />
      </div>
    </Link>
  );
};
