import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, ShieldCheck, Clock3, Inbox, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { getServices } from '../../services/api/services';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { ComingSoonModal } from '../../components/ComingSoonModal/ComingSoonModal';
import { ServiceCardSkeleton } from '../../components/SkeletonLoader/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

export const Services = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLockedService, setSelectedLockedService] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
  });

  const services = data?.data || [];

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleLockedClick = (name) => {
    setSelectedLockedService(name);
    setModalOpen(true);
  };

  const filteredServices = services
    .filter((service) => activeCategory === 'all' || service.category === activeCategory)
    .filter((service) => service.nameEn.toLowerCase().includes(search.toLowerCase()));

  const valueCards = [
    { icon: ShieldCheck, title: t('servicesPage.value1Title'), desc: t('servicesPage.value1Desc') },
    { icon: Clock3, title: t('servicesPage.value2Title'), desc: t('servicesPage.value2Desc') },
    { icon: Sparkles, title: t('servicesPage.value3Title'), desc: t('servicesPage.value3Desc') },
  ];

  const faqItems = [
    { q: t('servicesPage.faq1Q'), a: t('servicesPage.faq1A') },
    { q: t('servicesPage.faq2Q'), a: t('servicesPage.faq2A') },
    { q: t('servicesPage.faq3Q'), a: t('servicesPage.faq3A') },
  ];

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden pb-8 pt-6 text-center sm:pb-10">
        <div className=" pointer-events-none absolute inset-0" />
        <div className="relative">
          <p className="eyebrow">{t('servicesPage.badge')}</p>
          <h1 className="headline mt-3">{t('services.allServices')}</h1>
          <p className="lead mx-auto mt-4 max-w-2xl">{t('servicesPage.heroDesc')}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="chip">{t('servicesPage.heroTag1')}</span>
            <span className="chip">{t('servicesPage.heroTag2')}</span>
            <span className="chip">{t('servicesPage.heroTag3')}</span>
          </div>
        </div>
      </section>

      {/* Value cards */}
      <section className="grid gap-4 border-y border-border-50 px-4 py-8 sm:grid-cols-3 sm:px-8">
        {valueCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-12 text-primary-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">{card.title}</h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Controls */}
      <section className="sticky top-16 z-30 -mx-5 border-b border-border-50 bg-background-85 px-5 py-4 backdrop-blur-xl sm:top-20 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative lg:max-w-xs lg:flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t('services.search')}
              className="w-full rounded-full border border-border-70 bg-surface-80 py-3 pl-11 pr-4 text-sm text-text-primary outline-none backdrop-blur transition-colors focus:border-primary-50 focus:shadow-md"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'border border-border bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              {t('servicesPage.allCategories')}
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'border border-border bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-8 sm:py-10">
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <ErrorState title={t('servicesPage.errorTitle')} description={t('servicesPage.errorDesc')} onRetry={refetch} />
        )}

        {!isLoading && !isError && filteredServices.length === 0 && (
          <EmptyState icon={Inbox} title={t('services.noResults')} description={t('servicesPage.noResultsDesc')} />
        )}

        {!isLoading && !isError && filteredServices.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service._id || service.slug}
                service={service}
                index={index}
                onLockedClick={handleLockedClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* How + FAQ */}
      <section className="grid gap-10 border-t border-border-50 pt-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{t('servicesPage.howLabel')}</p>
          <h2 className="headline-2 mt-2">{t('servicesPage.howTitle')}</h2>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="card-soft p-5">
                <p className="text-sm font-medium text-primary-700">{t(`servicesPage.step${step}Label`)}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{t(`servicesPage.step${step}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{t('servicesPage.faqLabel')}</p>
          <h2 className="headline-2 mt-2">{t('servicesPage.faqTitle')}</h2>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="card-soft p-5">
                <p className="font-semibold text-text-primary">{item.q}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={selectedLockedService}
      />
    </div>
  );
};