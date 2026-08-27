import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Phone,
  Clock3,
  ArrowUpRight,
  Navigation,
  MessageSquare,
  BadgeCheck,
} from 'lucide-react';
import { EnquiryForm } from '../../components/EnquiryForm/EnquiryForm';
import { getServices } from '../../services/api/services';

const CONTACT_NUMBER = '+91 8282050022';
const CONTACT_EMAIL = 'greenshieldhomesolutions@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;
const MAP_LAT = 22.992999;
const MAP_LNG = 88.445392;
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&output=embed`;
const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_LAT},${MAP_LNG}`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_LAT},${MAP_LNG}`;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.08 },
  }),
};

export const Contact = () => {
  const { t } = useTranslation();

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'contact-options'],
    queryFn: () => getServices(),
  });
  const services = servicesData?.data || [];

  const channels = [
    {
      icon: Phone,
      label: t('contactPage.callLabel'),
      value: CONTACT_NUMBER,
      href: `tel:${CONTACT_NUMBER.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: t('contactPage.emailLabel'),
      value: CONTACT_EMAIL,
      href: GMAIL_COMPOSE_URL,
      external: true,
    },
    {
      icon: MapPin,
      label: t('contact.address'),
      value: 'Kolkata, India',
      href: MAP_LINK_URL,
      external: true,
    },
  ];

  const heroActions = [
    { icon: Phone, label: t('contactPage.callNow'), href: `tel:${CONTACT_NUMBER.replace(/\s/g, '')}` },
    { icon: Mail, label: t('contactPage.emailNow'), href: GMAIL_COMPOSE_URL, external: true },
    { icon: Navigation, label: t('contactPage.getDirections'), href: MAP_DIRECTIONS_URL, external: true },
  ];

  const helpCards = [
    { icon: BadgeCheck, title: t('contactPage.help1Title'), desc: t('contactPage.help1Desc') },
    { icon: MessageSquare, title: t('contactPage.help2Title'), desc: t('contactPage.help2Desc') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-4 text-center sm:py-8">
        <motion.span
          variants={reveal}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full border border-success-25 bg-success-10 px-4 py-2 text-sm font-medium text-success"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {t('contactPage.heroBadge')}
        </motion.span>

        <motion.h1
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={1}
          className="headline mx-auto mt-6 max-w-3xl"
        >
          {t('contact.title')}
        </motion.h1>

        <motion.p
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={2}
          className="lead mx-auto mt-4 max-w-2xl"
        >
          {t('contact.subtitle')}
        </motion.p>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={3} className="mt-9 flex flex-wrap justify-center gap-3">
          {heroActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noreferrer' : undefined}
                className={
                  action.external
                    ? 'btn-pill-ghost'
                    : 'btn-pill-primary'
                }
              >
                <Icon className="h-4 w-4" />
                {action.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            );
          })}
        </motion.div>
      </section>

      {/* Form + contact rail */}
      <section className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
        >
          <div className="card-soft relative p-5 sm:p-8">
            <p className="eyebrow">{t('contactPage.formBadge')}</p>
            <h2 className="headline-2 mt-2 text-2xl">{t('contact.sendMessage')}</h2>
            <p className="lead mt-3 max-w-xl text-sm">{t('contactPage.formDesc')}</p>

            <div className="mt-6">
              <EnquiryForm submitLabel={t('contact.sendMessage')} services={services} allowMultipleServices />
            </div>
          </div>
        </motion.div>

        {/* Rail */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          custom={1}
          className="flex flex-col gap-6"
        >
          {/* Direct contact */}
          <div className="card-soft">
            <div className="px-6 pb-2 pt-6">
              <p className="eyebrow">{t('contactPage.infoBadge')}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-text-primary">{t('contactPage.infoTitle')}</h3>
            </div>
            <div className="divide-y divide-border/50 px-3 pb-3 pt-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const inner = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-12 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium uppercase tracking-wide text-text-muted">
                        {channel.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-semibold text-text-primary">
                        {channel.value}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted" />
                  </>
                );
                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noreferrer' : undefined}
                    className="group flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-primary-10"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={channel.label} className="flex items-center gap-4 px-3 py-4">
                    {inner}
                  </div>
                );
              })}

              <div className="flex items-center gap-4 px-3 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/12 to-purple-500/12 text-violet-500">
                  <Clock3 className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wide text-text-muted">
                    {t('contactPage.hoursLabel')}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-text-primary">
                    {t('contactPage.hoursValue')}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Open
                </span>
              </div>
            </div>
          </div>

          {/* Compact map */}
          <div className="group relative overflow-hidden rounded-[28px] border border-border-50 bg-surface-60">
            <iframe
              title={t('contactPage.mapTitle')}
              src={MAP_EMBED_URL}
              className="h-48 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-4 pb-3 pt-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                <Navigation className="h-3 w-3" />
                {t('contactPage.mapBadge')}
              </span>
              <p className="mt-1.5 text-sm font-semibold text-white drop-shadow-sm">
                {t('contactPage.mapTitle')} · {t('contactPage.mapDesc')}
              </p>
            </div>
            <a
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105"
            >
              {t('contactPage.getDirections')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Help band */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {helpCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              custom={index}
              className="card-soft group flex items-start gap-4 p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-12 text-primary-700 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};