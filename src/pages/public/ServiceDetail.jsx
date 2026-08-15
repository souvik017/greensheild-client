import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Package,
  ShieldCheck,
  Star,
  Tag,
  Timer,
} from 'lucide-react';
import { getServiceBySlug, getServices } from '../../services/api/services';
import { EnquiryForm } from '../../components/EnquiryForm/EnquiryForm';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CATEGORIES } from '../../utils/constants';
import { getServiceName, getServiceDescription } from '../../utils/serviceName';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.07 },
  }),
};

export const ServiceDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => getServiceBySlug(slug),
    retry: false,
  });

  const { data: catalog } = useQuery({
    queryKey: ['services', 'related'],
    queryFn: getServices,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-shimmer h-64 w-full rounded-[32px] bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]" />
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <LoadingState rows={3} />
          <LoadingState rows={2} />
        </div>
      </div>
    );
  }

  const notFound = isError && error?.response?.status === 404;

  if (isError || !response?.data) {
    return (
      <ErrorState
        title={notFound ? t('serviceDetail.notFoundTitle') : t('serviceDetail.errorTitle')}
        description={notFound ? t('serviceDetail.notFoundDesc') : t('serviceDetail.errorDesc')}
        onRetry={refetch}
        retryLabel={t('serviceDetail.retry')}
      />
    );
  }

  const service = response.data;
  const serviceName = getServiceName(service, i18n);
  const serviceDescription = getServiceDescription(service, i18n);
  const categoryLabel = CATEGORIES.find((category) => category.id === service.category)?.labelKey;
  const enquiryFields = service.enquiryFields || [];

  const similar = (catalog?.data || [])
    .filter(
      (item) =>
        item.slug !== service.slug &&
        item.category === service.category &&
        item.status === 'active',
    )
    .slice(0, 3);

  const trustPoints = [
    { icon: ShieldCheck, title: t('trust.title1'), desc: t('trust.desc1') },
    { icon: Clock3, title: t('trust.title2'), desc: t('trust.desc2') },
    { icon: BadgeCheck, title: t('trust.title3'), desc: t('trust.desc3') },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
        <Link to="/" className="transition-colors hover:text-primary-700">
          {t('nav.home')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/services" className="transition-colors hover:text-primary-700">
          {t('nav.services')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-text-primary">{serviceName}</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[36px] border border-border-50 bg-surface-60 backdrop-blur">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left column – text */}
          <motion.div initial="hidden" animate="show" className="p-6 sm:p-10 lg:p-14">
            <motion.p variants={fadeUp} custom={0} className="eyebrow">
              {t('serviceDetail.badge')}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl"
            >
              {serviceName}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 max-w-2xl text-base leading-7 text-text-secondary"
            >
              {serviceDescription}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-7 flex flex-wrap items-center gap-2">
              <StatusBadge status={service.status} label={t(`services.${service.status}`)} />
              {categoryLabel && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-20 bg-primary-10 px-4 py-1.5 text-sm font-medium text-primary-700">
                  <Tag className="h-4 w-4" />
                  {t(categoryLabel)}
                </span>
              )}
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-9 flex flex-wrap gap-3">
              <a href="#enquiry" className="btn-pill-primary">
                {t('layout.bookNow')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#about" className="btn-pill-ghost">
                {t('serviceDetail.aboutTitle')}
              </a>
            </motion.div>
          </motion.div>

          {/* Right column – image (updated for any ratio) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="relative h-64 w-full overflow-hidden md:h-[340px] lg:h-[420px]"
          >
            {service.image ? (
              <img
                src={service.image}
                alt={serviceName}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-12">
                <Package className="h-20 w-20 text-primary-500" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-transparent" />

            <motion.div
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              4.9 · {t('stats.rating')}
            </motion.div>

            <motion.div
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <Timer className="h-4 w-4 text-emerald-200" />
              <div>
                <p className="text-[10px] text-white/70">{t('home.heroPanel1Label')}</p>
                <p className="text-xs font-semibold text-white">{t('home.heroPanel1Value')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-4 border-b border-border-50 py-10 sm:grid-cols-3"
      >
        {trustPoints.map((point, index) => {
          const Icon = point.icon;
          return (
            <motion.div key={point.title} variants={fadeUp} custom={index} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-12 text-primary-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">{point.title}</h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">{point.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* About + form */}
      <section className="mt-10 grid items-start gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10" id="about">
          <div>
            <p className="eyebrow">{t('serviceDetail.aboutTitle')}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              {serviceDescription || t('serviceDetail.noDescription')}
            </p>
          </div>

          {enquiryFields.length > 0 && (
            <div>
              <h2 className="headline-2 text-2xl">{t('serviceDetail.requiredInfoTitle')}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {enquiryFields.map((field) => (
                  <div key={field.name} className="card-soft flex items-start gap-3 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{field.label}</p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        {field.required ? t('serviceDetail.requiredField') : t('serviceDetail.optionalField')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {similar.length > 0 && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">{t('services.flagship')}</p>
                  <h2 className="headline-2 mt-2">{t('services.flagshipSub')}</h2>
                </div>
                <Link to="/services" className="btn-pill-ghost shrink-0">
                  {t('services.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((item, index) => (
                  <ServiceCard key={item._id || item.slug} service={item} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="enquiry">
          <div className="sticky top-28 rounded-[32px] border border-border-50 bg-surface-70 p-5 shadow-md backdrop-blur">
            <EnquiryForm
              serviceId={service._id}
              serviceSlug={service.slug}
              serviceName={serviceName}
              category={service.category}
              categoryFields={enquiryFields}
              submitLabel={t('enquiry.submitGeneral')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};