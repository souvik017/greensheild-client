import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ label = 'Loading...', rows = 3 }) => {
  if (!label) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-shimmer rounded-[24px] bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%]"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center rounded-[28px] border border-border bg-surface px-6 py-14 text-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p className="mt-4 text-sm font-medium text-text-secondary">{label}</p>
    </motion.div>
  );
};
