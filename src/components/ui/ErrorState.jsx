import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../Button/Button';

export const ErrorState = ({ title = 'Something went wrong', description, onRetry, retryLabel = 'Try again' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-[28px] border border-border bg-surface px-6 py-14 text-center"
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
      <AlertTriangle className="h-7 w-7" />
    </div>
    <h3 className="mt-5 text-lg font-semibold text-text-primary">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">{description}</p>}
    {onRetry && (
      <Button variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" />} className="mt-6">
        {retryLabel}
      </Button>
    )}
  </motion.div>
);
