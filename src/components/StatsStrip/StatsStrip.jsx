import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { STATS_DATA } from '../../utils/constants';

const CountValue = ({ value, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^([\d.,]+)(.*)$/);
    if (!match) return;
    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2];
    const controls = animate(0, target, {
      duration: 1.6,
      ease: 'easeOut',
      delay,
      onUpdate: (v) => {
        const digits = Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1);
        setDisplay(`${digits}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="font-display text-3xl font-bold tracking-tight md:text-4xl">{display}</div>
    </motion.div>
  );
};

export const StatsStrip = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'customers', value: STATS_DATA.customers },
    { key: 'professionals', value: STATS_DATA.professionals },
    { key: 'services', value: STATS_DATA.services },
    { key: 'cities', value: STATS_DATA.cities },
    { key: 'rating', value: STATS_DATA.rating },
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0b1f16_0%,#0a2e26_50%,#0c1727_100%)] text-white shadow-xl">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-[110px]" />
      <div className="relative grid gap-px bg-white/5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, idx) => (
          <div key={stat.key} className="bg-[rgba(12,36,29,0.6)] px-6 py-8 text-center sm:py-10">
            <CountValue value={stat.value} delay={idx * 0.08} />
            <div className="mt-2 text-sm font-medium text-white/60">{t(`stats.${stat.key}`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};