import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-7xl font-semibold tracking-tight text-text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-text-primary">{t('notFound.title')}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">{t('notFound.message')}</p>
      <Link to="/" className="btn-pill-primary mt-8 px-7 py-3">
        {t('notFound.goHome')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};