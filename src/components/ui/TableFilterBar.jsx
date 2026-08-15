import { useTranslation } from 'react-i18next';
import { CalendarRange, Filter, X } from 'lucide-react';
import { Select, Input } from './FormControls';

export const DateRangeFilterBar = ({ from, to, onFromChange, onToChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
        <CalendarRange className="h-4 w-4" />
        {t('admin.dateFilter')}
      </span>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          className="w-full sm:w-auto"
          aria-label={t('admin.fromDate')}
        />
        <span className="hidden text-text-muted sm:inline">—</span>
        <Input
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          className="w-full sm:w-auto"
          aria-label={t('admin.toDate')}
        />
      </div>
    </div>
  );
};

export const TableFilterBar = ({
  statusOptions,
  statusValue,
  onStatusChange,
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}) => {
  const { t } = useTranslation();
  const hasFilter = (statusValue && statusValue !== 'all') || !!from || !!to;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-surface/60 p-4 shadow-card backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-5">
        {statusOptions && statusOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 shrink-0 text-text-muted" />
            <Select
              value={statusValue}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">{t('admin.allStatus')}</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {t(`status.${status.value}`)}
                </option>
              ))}
            </Select>
          </div>
        )}

        <DateRangeFilterBar from={from} to={to} onFromChange={onFromChange} onToChange={onToChange} />
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-danger/40 hover:text-danger"
        >
          <X className="h-4 w-4" />
          {t('admin.clearFilter')}
        </button>
      )}
    </div>
  );
};