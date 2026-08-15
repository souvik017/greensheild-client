import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md', contentClassName = '' }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className={`relative z-10 w-full ${sizes[size]} rounded-3xl border border-border bg-surface shadow-modal`}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className={`max-h-[calc(100vh-8rem)] overflow-y-auto p-4 sm:p-6 ${contentClassName}`}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
