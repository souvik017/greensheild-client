import { motion } from 'framer-motion';

export const AmbientBackground = ({ intensity = 'normal' }) => {
  const opacity = intensity === 'subtle' ? 'opacity-50' : 'opacity-90';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${opacity}`}
    >
      <div className="bg-grid-fade absolute inset-0" />
      <div className="animate-aurora absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-[70%] rounded-full bg-[var(--color-primary-500)] opacity-[0.13] blur-[120px]" />
      <div className="animate-aurora absolute -top-20 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-[#22d3ee] opacity-[0.10] blur-[120px] [animation-delay:4s]" />
      <div className="animate-aurora absolute bottom-[-12rem] left-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#a78bfa] opacity-[0.08] blur-[130px] [animation-delay:8s]" />
      <motion.div
        className="absolute right-[12%] top-[22%] h-24 w-24 rounded-full border border-primary-500/25"
        animate={{ y: [0, -22, 0], x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[8%] top-[58%] h-16 w-16 rounded-full border border-cyan-400/20"
        animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary-500)/8,transparent_55%)]" />
    </div>
  );
};