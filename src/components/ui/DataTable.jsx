import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableRowSkeleton } from '../SkeletonLoader/SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

const MobileRowSkeleton = () => (
  <div className="h-28 animate-shimmer rounded-2xl bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]" />
);

const getPageItems = (current, total) => {
  const set = new Set([1, total]);
  for (let i = current - 2; i <= current + 2; i += 1) {
    if (i >= 1 && i <= total) set.add(i);
  }
  const items = [];
  let prev = 0;
  for (const item of [...set].sort((a, b) => a - b)) {
    if (item - prev > 1) items.push('ellipsis');
    items.push(item);
    prev = item;
  }
  return items;
};

const Pagination = ({ page, pages, pageSize, pageSizeOptions, onPageChange, onPageSizeChange, showingLabel }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6">
      <p className="text-sm text-text-muted">{showingLabel}</p>

      <div className="flex flex-wrap items-center gap-2">
        {pageSizeOptions && pageSizeOptions.length > 0 && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-primary outline-none focus:border-primary-300"
            aria-label={t('admin.perPage')}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-2"
            aria-label={t('admin.previous')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageItems(page, pages).map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`e${index}`} className="px-1 text-sm text-text-muted">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-medium transition-colors ${
                  item === page
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'border border-border text-text-secondary hover:bg-surface-2'
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-2"
            aria-label={t('admin.next')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const DataTable = ({
  columns = [],
  rows = [],
  renderRow,
  renderCard,
  loading,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  error,
  onRetry,
  colSpan,
  pageSize = 10,
  pageSizeOptions,
  page,
  onPageChange,
  onPageSizeChange,
  total,
  totalPages,
  serverSide,
  paginate,
}) => {
  const { t } = useTranslation();
  const span = colSpan || columns.length;
  const showState = !loading && (isEmpty || error);

  const currentPage = page || 1;
  const itemCount = serverSide ? (total != null ? total : rows.length) : rows.length;
  const pageCount = serverSide
    ? totalPages || Math.max(1, Math.ceil(itemCount / pageSize))
    : Math.max(1, Math.ceil(itemCount / pageSize));

  const safePage = Math.min(currentPage, pageCount);
  const displayedRows = serverSide
    ? rows
    : rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const showPagination = !!paginate && pageCount > 1;
  const startItem = itemCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, itemCount);
  const showingLabel = t('admin.showing', {
    from: startItem,
    to: endItem,
    total: itemCount,
  });

  const handlePageSizeChange = (size) => {
    onPageSizeChange?.(size);
    onPageChange?.(1);
  };

  useEffect(() => {
    if (!serverSide && page > pageCount) {
      onPageChange?.(pageCount);
    }
  }, [serverSide, page, pageCount, onPageChange]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface/70 shadow-card backdrop-blur-xl">
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wider text-text-secondary">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-4 font-medium whitespace-nowrap">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={span}>
                        <TableRowSkeleton />
                      </td>
                    </tr>
                  ))
                : displayedRows.map(renderRow)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      {!loading && !isEmpty && !error && renderCard && (
        <div className="grid gap-3 p-4 md:hidden">
          {displayedRows.map(renderCard)}
        </div>
      )}

      {/* Mobile loading skeleton */}
      {loading && (
        <div className="grid gap-3 p-4 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <MobileRowSkeleton key={index} />
          ))}
        </div>
      )}

      {showState && (
        <div className="border-t border-border p-6">
          {error ? (
            <ErrorState description={error} onRetry={onRetry} />
          ) : (
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
          )}
        </div>
      )}

      {showPagination && !loading && (
        <Pagination
          page={safePage}
          pages={pageCount}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={onPageChange}
          onPageSizeChange={pageSizeOptions ? handlePageSizeChange : undefined}
          showingLabel={showingLabel}
        />
      )}
    </div>
  );
};