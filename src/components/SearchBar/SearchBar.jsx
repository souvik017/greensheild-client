import { useState } from 'react';
import { Search, MapPin, ArrowRight, LocateFixed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { POPULAR_SEARCHES } from '../../utils/constants';
import { useGeolocation } from '../../hooks/useGeolocation';

export const SearchBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, city, detect } = useGeolocation();
  const [query, setQuery] = useState('');

  const locating = status === 'loading';
  const locationLabel =
    status === 'ready' && city ? city : t('hero.locationFallback');

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/services?search=${encodeURIComponent(value)}`);
  };

  const handleChipClick = (term) => {
    setQuery(term);
    navigate(`/services?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full max-w-3xl">
      <form
        onSubmit={handleSearch}
        className="overflow-hidden rounded-3xl border border-border-70 bg-surface-80 shadow-sm backdrop-blur-xl transition-all duration-300 focus-within:border-primary-50 focus-within:shadow-md sm:flex sm:flex-row sm:items-stretch sm:rounded-full"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:w-56 sm:border-b-0 sm:border-r sm:px-5 sm:py-0">
          <div className="relative shrink-0">
            <MapPin className="h-5 w-5 text-primary-700" />
            {status === 'ready' && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-success opacity-75" />
            )}
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <span className="block truncate text-sm font-medium text-text-primary">{locationLabel}</span>
            <span className="block text-[11px] leading-tight text-text-muted">
              {locating ? t('hero.locating') : status === 'ready' ? t('hero.liveLocation') : t('nav.serving')}
            </span>
          </div>
          <button
            type="button"
            onClick={detect}
            aria-label={t('hero.locateMe')}
            title={t('hero.locateMe')}
            className="ml-1 shrink-0 rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface-2 hover:text-primary-700"
          >
            <LocateFixed className={`h-4 w-4 ${locating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-3 px-4 py-3 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>

        <div className="p-3 sm:p-2">
          <button
            type="submit"
            className="btn-pill-primary w-full rounded-full px-6 py-2.5 sm:w-auto"
          >
            {t('hero.searchBtn')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-text-secondary sm:mt-6">
        <span className="text-xs font-medium text-text-primary sm:text-sm">{t('hero.popular')}</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleChipClick(term)}
            className="rounded-full border border-border-60 bg-surface-60 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur transition-all hover:border-primary-400 hover:text-primary-700 sm:px-3.5 sm:text-sm"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};