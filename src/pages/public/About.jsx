import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, Clock3, MapPinned, HeartHandshake } from 'lucide-react';
import { STATS_DATA } from '../../utils/constants';
import { SEO } from '../../components/SEO';
import { LocalBusinessSchema, BreadcrumbSchema } from '../../components/StructuredData';
import { PAGE_META } from '../../utils/seoConfig';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.07 },
  }),
};

export const About = () => {
  const { t } = useTranslation();

  const pillars = [
    { icon: ShieldCheck, title: t('aboutPage.pillar1Title'), desc: t('aboutPage.pillar1Desc') },
    { icon: Sparkles, title: t('aboutPage.pillar2Title'), desc: t('aboutPage.pillar2Desc') },
    { icon: Users, title: t('aboutPage.pillar3Title'), desc: t('aboutPage.pillar3Desc') },
    { icon: Clock3, title: t('aboutPage.pillar4Title'), desc: t('aboutPage.pillar4Desc') },
  ];

  const milestones = [
    t('aboutPage.milestone1'),
    t('aboutPage.milestone2'),
    t('aboutPage.milestone3'),
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-4 text-center sm:py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <p className="eyebrow">{t('aboutPage.badge')}</p>
          <h1 className="headline mt-3">{t('about.title')}</h1>
          <p className="lead mx-auto mt-4 max-w-2xl">{t('about.subtitle')}</p>
        </motion.div>
      </section>

      {/* Numbers */}
      <section className="grid gap-px overflow-hidden rounded-[28px] border border-border-50 bg-border-40 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('aboutPage.stat1'), value: STATS_DATA.customers },
          { label: t('aboutPage.stat2'), value: STATS_DATA.professionals },
          { label: t('aboutPage.stat3'), value: STATS_DATA.services },
          { label: t('aboutPage.stat4'), value: STATS_DATA.cities },
        ].map((item) => (
          <div key={item.label} className="bg-surface-70 p-8 text-center">
            <p className="font-display text-3xl font-semibold tracking-tight text-text-primary">{item.value}</p>
            <p className="mt-2 text-sm text-text-muted">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="lg:sticky lg:top-28">
            <p className="eyebrow">{t('aboutPage.storyBadge')}</p>
            <h2 className="headline-2 mt-2">{t('aboutPage.storyTitle')}</h2>
            <p className="lead mt-4">{t('aboutPage.storyDesc')}</p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: MapPinned, title: t('aboutPage.localTitle'), desc: t('aboutPage.localDesc') },
              { icon: HeartHandshake, title: t('aboutPage.careTitle'), desc: t('aboutPage.careDesc') },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                  className="card-soft p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-12 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="grid gap-10 border-t border-border-50 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="eyebrow">{t('aboutPage.missionBadge')}</p>
          <h2 className="headline-2 mt-2">{t('about.mission')}</h2>
          <p className="lead mt-4">{t('about.missionText')}</p>
          <h3 className="mt-8 font-display text-xl font-semibold text-text-primary">{t('about.vision')}</h3>
          <p className="lead mt-3">{t('about.visionText')}</p>
        </motion.div>

        <div className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                  className="card-soft p-6"
                >
                  <Icon className="h-5 w-5 text-primary-700" />
                  <h3 className="mt-4 font-display text-base font-semibold text-text-primary">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-border-50 bg-surface-50 p-7 backdrop-blur">
            <p className="eyebrow">Milestones</p>
            <div className="mt-5 space-y-5">
              {milestones.map((item, index) => (
                <div key={item} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};