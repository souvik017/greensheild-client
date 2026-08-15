import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, CheckSquare2, Square, LayoutList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MultiSelect = ({
  options = [],
  selected = [],
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  className = '',
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => String(option.label || '').toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (value) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const label = placeholder || t('enquiry.selectServicesPlaceholder');

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          <LayoutList className="h-4 w-4 shrink-0 text-text-muted" />
          <span className={`truncate ${selected.length === 0 ? 'text-text-muted' : 'font-medium text-text-primary'}`}>
            {selected.length > 0
              ? `${selected.length} ${t('enquiry.servicesSelected')}`
              : label}
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-modal"
          >
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder || t('enquiry.searchServices')}
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary-300"
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-text-muted">{emptyText || t('enquiry.noServicesFound')}</p>
              ) : (
                filtered.map((option) => {
                  const isChecked = selected.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggle(option.value)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        isChecked ? 'bg-primary-500/10 text-primary-700' : 'text-text-secondary hover:bg-surface-2'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare2 className="h-4 w-4 shrink-0 text-primary-600" />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-text-muted" />
                      )}
                      <span className="truncate leading-5">{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>

            {selected.length > 0 && (
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="w-full rounded-xl px-3 py-2 text-center text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                >
                  {t('enquiry.clearSelection')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};