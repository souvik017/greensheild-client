import { STATUS_COLORS } from '../../utils/constants';

export const StatusBadge = ({ status, label }) => {
  const color = STATUS_COLORS[status] || 'bg-surface-2 text-text-muted border border-border';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label || status}
    </span>
  );
};
