import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  HeadphonesIcon,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Wrench,
  Zap,
} from 'lucide-react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { StatsStrip } from '../../components/StatsStrip/StatsStrip';
import { getServices } from '../../services/api/services';

const POPULAR_SLUGS = [
  'pest-control',
  'ac-service-repair',
  'refrigerator-repair',
  'washing-machine-repair',
  'ro-water-purifier-service',
  'kitchen-chimney-service',
  'electrician',
  'packers-movers',
];

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 44, scale: 0.96, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay: i * 0.09 },
  }),
};

const fromLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE, delay: i * 0.1 },
  }),
};

const fromRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE, delay: i * 0.1 },
  }),
};

const riseScale = {
  hidden: { opacity: 0, y: 60, scale: 0.88 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.1 },
  }),
};

const views = { once: true, amount: 0.25 };

const ServiceCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-border-60 bg-surface-60">
    <div className="h-36 animate-shimmer bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] sm:h-48" />
    <div className="space-y-3 p-5 sm:p-6">
      <div className="h-4 w-2/3 animate-shimmer rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]" />
      <div className="h-3 w-full animate-shimmer rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]" />
      <div className="h-3 w-1/2 animate-shimmer rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]" />
    </div>
  </div>
);

const TiltCard = ({ children }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 24 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 24 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="relative [perspective:1400px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative w-full">
        {children}
      </motion.div>
    </motion.div>
  );
};

const HeroVisual = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const y = useTransform(scrollYProgress, [0, 1], [130, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [1.5, 0]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-5xl">
      <div className="orb-bottom pointer-events-none absolute -inset-x-8 -bottom-10 top-10" />
      <TiltCard>
        <motion.div
          style={{ y, scale, rotate }}
          className="relative overflow-hidden rounded-[32px] border border-border-60 bg-surface-70 shadow-2xl shadow-black/20 sm:rounded-[44px]"
        >
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=1000"
            alt="Home service professional"
            className="h-72 w-full object-cover sm:h-[440px] lg:h-[540px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
            style={{ transform: 'translateZ(60px)' }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live &amp; Verified
          </div>

          <div
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-md"
            style={{ transform: 'translateZ(60px)' }}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-white">4.9</span>
            <span className="text-[11px] text-white/70">· {t('stats.rating')}</span>
          </div>

          <motion.div
            className="absolute bottom-5 left-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-xl sm:flex"
            style={{ transform: 'translateZ(50px)' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/25 text-emerald-200">
              <Timer className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] text-white/70">{t('home.heroPanel1Label')}</p>
              <p className="text-sm font-semibold text-white">{t('home.heroPanel1Value')}</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-5 right-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-xl sm:flex"
            style={{ transform: 'translateZ(50px)' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/25 text-cyan-100">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] text-white/70">{t('home.heroPanel2Label')}</p>
              <p className="text-sm font-semibold text-white">{t('home.heroPanel2Value')}</p>
            </div>
          </motion.div>
        </motion.div>
      </TiltCard>
    </div>
  );
};

export const Home = () => {
  const { t } = useTranslation();

  const servicesQuery = useQuery({
    queryKey: ['popularServices'],
    queryFn: getServices,
    staleTime: 5 * 60 * 1000,
  });

  const allServices = servicesQuery.data?.data || [];
  const featuredServices = POPULAR_SLUGS.map((slug) => allServices.find((service) => service.slug === slug)).filter(
    Boolean
  );
  const popularLoading = servicesQuery.isLoading;

  const featureCards = [
    { icon: ShieldCheck, title: t('home.features.trusted.title'), desc: t('home.features.trusted.desc') },
    { icon: Zap, title: t('home.features.minimal.title'), desc: t('home.features.minimal.desc') },
    { icon: HeadphonesIcon, title: t('home.features.support.title'), desc: t('home.features.support.desc') },
  ];

  const testimonials = [
    { name: t('home.testimonials.oneName'), quote: t('home.testimonials.oneQuote') },
    { name: t('home.testimonials.twoName'), quote: t('home.testimonials.twoQuote') },
    { name: t('home.testimonials.threeName'), quote: t('home.testimonials.threeQuote') },
  ];

  const processSteps = Array.from({ length: 4 }, (_, index) => index + 1);

  const marqueeItems = [
    t('categories.cleaning'),
    t('categories.electrical-electronics'),
    t('categories.pest-control'),
    t('categories.home-repair'),
    t('categories.gardening'),
    t('categories.shifting-logistics'),
    t('categories.salon-beauty'),
    t('categories.maintenance'),
    t('categories.interior-furniture'),
    t('categories.health-wellness'),
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className=" pointer-events-none absolute inset-0" />
        <div className="hero-backdrop-accent pointer-events-none absolute inset-0" />

        <div className="relative wrap pb-12 pt-8 text-center sm:pb-20 sm:pt-8">
          <motion.div initial="hidden" animate="show" className="mx-auto max-w-3xl">
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-primary-20 bg-primary-10 px-3.5 py-1.5 text-xs font-medium text-primary-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              {t('hero.badge')}
            </motion.span>

           <motion.h1
  variants={fadeUp}
  custom={1}
  className="mt-5 font-display text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-text-primary sm:mt-6 sm:text-6xl lg:text-7xl"
>
  <span className="leading-[1.1]">
    {t('hero.title1')}
  </span>
  <br />
  <span className="text-gradient-brand leading-[0.95]">
    {t('hero.title2')}
  </span>
</motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-base font-medium text-text-secondary sm:mt-5 sm:text-2xl"
            >
              {t('hero.title3')}
            </motion.p>

            <motion.p variants={fadeUp} custom={3} className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:mt-4 sm:text-base sm:leading-7">
              {t('home.heroDesc')}
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="mt-8 sm:mt-10">
              <SearchBar />
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={5}
              className="mx-auto mt-6 grid w-full max-w-sm gap-3 sm:mt-8 sm:flex sm:w-auto sm:max-w-none sm:justify-center"
            >
              <Link to="/contact" className="btn-pill-primary w-full px-7 py-3 sm:w-auto">
                {t('layout.bookNow')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="btn-pill-ghost w-full px-7 py-3 sm:w-auto">
                {t('nav.services')}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={6}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            >
              <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <BadgeCheck className="h-4 w-4 text-success" />
                {t('hero.trust1')}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <Clock3 className="h-4 w-4 text-primary-700" />
                {t('hero.trust2')}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <HeadphonesIcon className="h-4 w-4 text-primary-700" />
                {t('home.heroTrust3')}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="wrap pb-14 sm:pb-16">
          <HeroVisual />
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-border-50 py-4">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-text-secondary"
            >
              <Wrench className="h-4 w-4 text-primary-700" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border-50 py-14 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {featureCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={views}
                custom={index}
                className="text-center sm:text-left"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-12 text-primary-700 sm:mx-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured services */}
      <section className="py-14 sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={views}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">{t('home.featuredLabel')}</p>
            <h2 className="headline-2 mt-2">{t('services.popular')}</h2>
            <p className="lead mt-3">{t('home.featuredDesc')}</p>
          </div>
          <Link to="/services" className="btn-pill-ghost shrink-0">
            {t('services.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {popularLoading ? (
            Array.from({ length: 8 }).map((_, index) => <ServiceCardSkeleton key={index} />)
          ) : featuredServices.length > 0 ? (
            featuredServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-border/60 bg-surface-60 p-10 text-center">
              <p className="text-sm text-text-secondary">{t('admin.errorGeneric')}</p>
              <Link to="/services" className="btn-pill-ghost mt-4">
                {t('services.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Promo band */}
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0b1f16_0%,#0a2e26_50%,#0c1727_100%)] px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-[110px]"
          animate={{ y: [0, 26, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-[110px]"
          animate={{ y: [0, -26, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          variants={riseScale}
          initial="hidden"
          whileInView="show"
          viewport={views}
          className="relative mx-auto max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            {t('promo.tag')}
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t('promo.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">{t('promo.desc')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-pill bg-white px-7 py-3 text-primary-700 hover:bg-emerald-50">
              {t('promo.btn')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-white/50">{t('promo.sub')}</p>
          </div>
        </motion.div>
      </section>

      {/* Process */}
      <section className="py-14 sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={views}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow">{t('howItWorks.title')}</p>
          <h2 className="headline-2 mt-2">{t('home.processTitle')}</h2>
          <p className="lead mt-3">{t('home.processDesc')}</p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {processSteps.map((step, index) => (
            <motion.div
              key={step}
              variants={index % 2 === 0 ? fromLeft : fromRight}
              initial="hidden"
              whileInView="show"
              viewport={views}
              custom={index}
              className="relative flex gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 font-display text-lg font-bold text-white shadow-lg shadow-black/10">
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={views}
                  transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.25 + index * 0.08 }}
                  className="block"
                >
                  {step}
                </motion.span>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {t(`howItWorks.step${step}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{t(`howItWorks.step${step}Desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story + promise */}
      <section className="grid gap-10 lg:grid-cols-2">
        <motion.div variants={fromLeft} initial="hidden" whileInView="show" viewport={views}>
          <p className="eyebrow">{t('home.storyLabel')}</p>
          <h2 className="headline-2 mt-2">{t('home.storyTitle')}</h2>
          <p className="lead mt-4">{t('home.storyDesc')}</p>

          <div className="mt-8 space-y-4">
            <motion.div whileHover={{ y: -6 }} className="card-soft flex gap-4 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-12 text-primary-700">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-text-primary">{t('home.storyPoint1Title')}</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">{t('home.storyPoint1Desc')}</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -6 }} className="card-soft flex gap-4 p-5">
<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-12 text-primary-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-text-primary">{t('home.storyPoint2Title')}</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">{t('home.storyPoint2Desc')}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fromRight}
          initial="hidden"
          whileInView="show"
          viewport={views}
          custom={1}
          className="rounded-[32px] border border-border-50 bg-surface-50 p-8 backdrop-blur sm:p-10"
        >
          <p className="eyebrow">{t('home.promiseLabel')}</p>
          <h2 className="headline-2 mt-2 text-primary-700">{t('home.promiseTitle')}</h2>
          <div className="mt-6 space-y-4">
            {[t('home.promise1'), t('home.promise2'), t('home.promise3')].map((item, index) => (
              <div key={item} className="flex items-start gap-3 text-sm leading-6 text-text-secondary">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border-50 py-14 sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={views}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow">{t('home.testimonialsLabel')}</p>
          <h2 className="headline-2 mt-2">{t('home.testimonialsTitle')}</h2>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={views}
              custom={index}
              className="card-soft p-6 transition-shadow duration-300 hover:shadow-xl"
              whileHover={{ y: -8 }}
            >
              <Star className="h-4 w-4 fill-warning text-warning" />
              <p className="mt-4 text-sm leading-6 text-text-secondary">“{testimonial.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-primary-700">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <StatsStrip />

      {/* CTA */}
      <section className="py-16 text-center sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={views}
          className="mx-auto max-w-xl"
        >
          <h2 className="headline-2">{t('contactPage.formBadge')}</h2>
          <p className="lead mt-4">{t('contactPage.formDesc')}</p>
          <Link to="/contact" className="btn-pill-primary mt-8 px-8 py-4">
            {t('layout.bookNow')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};