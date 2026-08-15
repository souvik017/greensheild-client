import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-border bg-surface/60 px-6 py-14 text-center"
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-text-muted">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="mt-5 text-lg font-semibold text-text-primary">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);
