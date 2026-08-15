import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { getDashboardStats, getAppointmentsForDay } from '../../services/api/dashboard';
import { StatCardSkeleton } from '../../components/SkeletonLoader/SkeletonLoader';
import { PageHeader } from '../../components/ui/PageHeader';
import { ErrorState } from '../../components/ui/ErrorState';
import { Select } from '../../components/ui/FormControls';
import { AppointmentBookingCard } from '../../components/appointment/AppointmentBookingCard';

const emptyStats = {
  totalEnquiries: 0,
  newEnquiries: 0,
  confirmedAppointments: 0,
  conversionRate: 0,
  enquiriesOverTime: [],
};

const IST_OFFSET_MS = 330 * 60 * 1000; // Asia/Kolkata is UTC+05:30

export const Dashboard = () => {
  const { t } = useTranslation();
  const [dayOffset, setDayOffset] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(),
  });

  const istDateStr = useMemo(
    () => (offset) => {
      const shifted = new Date(Date.now() + IST_OFFSET_MS + offset * 24 * 60 * 60 * 1000);
      return shifted.toISOString().slice(0, 10);
    },
    []
  );

  const selectedDateStr = istDateStr(dayOffset);

  const dayQuery = useQuery({
    queryKey: ['dashboardDayAppointments', selectedDateStr],
    queryFn: () => getAppointmentsForDay(selectedDateStr),
  });

  const stats = data?.data || emptyStats;
  const dayAppointments = dayQuery.data?.data || [];

  const statsList = [
    { label: t('admin.totalEnquiries'), value: stats.totalEnquiries, icon: MessageSquare, accent: 'from-sky-500/15 to-sky-500/5', iconClass: 'text-sky-600' },
    { label: t('admin.newEnquiries'), value: stats.newEnquiries, icon: Bell, accent: 'from-amber-500/15 to-amber-500/5', iconClass: 'text-amber-600' },
    { label: t('admin.confirmed'), value: stats.confirmedAppointments, icon: Calendar, accent: 'from-emerald-500/15 to-emerald-500/5', iconClass: 'text-emerald-600' },
    { label: t('admin.conversionRate'), value: `${Math.round(stats.conversionRate || 0)}%`, icon: TrendingUp, accent: 'from-primary-500/15 to-primary-500/5', iconClass: 'text-primary-700' },
  ];

  const dayOptions = useMemo(
    () =>
      Array.from({ length: 8 }, (_, offset) => {
        const date = new Date(`${istDateStr(offset)}T12:00:00`);
        const label =
          offset === 0
            ? `${t('admin.today')} · ${format(date, 'd MMM')}`
            : offset === 1
            ? `${t('admin.tomorrow')} · ${format(date, 'd MMM')}`
            : format(date, 'EEE d MMM');
        return { offset, label };
      }),
    [t, istDateStr]
  );

  const enquiriesOverTime = (stats.enquiriesOverTime || []).map((entry) => ({
    name: entry.date,
    value: entry.count,
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow={t('admin.overview')} title={t('admin.dashboard')} />
        <ErrorState
          title={t('admin.errorGeneric')}
          description={t('admin.dashboardErrorDesc')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={t('admin.overview')} title={t('admin.dashboard')} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br ${stat.accent} p-5 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow`}
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface/80 backdrop-blur sm:h-12 sm:w-12 ${stat.iconClass} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <p className="text-xs font-medium text-text-secondary sm:text-sm">{stat.label}</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-text-primary sm:text-3xl">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-[1.4]">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">{t('admin.appointmentsForDate')}</h3>
              <p className="mt-1 text-sm text-text-secondary">{t('admin.appointmentsForDateDesc')}</p>
            </div>
            <div className="w-full sm:w-64">
              <Select value={dayOffset} onChange={(event) => setDayOffset(Number(event.target.value))} className="w-full">
                {dayOptions.map((option) => (
                  <option key={option.offset} value={option.offset}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {dayQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-shimmer rounded-2xl border border-border/70 bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]"
                />
              ))}
            </div>
          ) : dayAppointments.length === 0 ? (
            <div className="rounded-3xl border border-border/70 bg-surface/70 px-6 py-14 text-center shadow-card">
              <Calendar className="mb-3 h-8 w-8 text-text-muted" />
              <p className="text-base font-medium text-text-primary">{t('admin.noAppointmentsForDay')}</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">{t('admin.noAppointmentsForDayDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <AppointmentBookingCard key={appointment._id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">{t('admin.enquiriesOverTime')}</h3>
          <div className="flex-1 rounded-3xl border border-border/70 bg-surface/70 p-6 shadow-card backdrop-blur-xl">
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enquiriesOverTime}>
                  <XAxis dataKey="name" stroke="currentColor" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis stroke="currentColor" tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1F7A3D" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
