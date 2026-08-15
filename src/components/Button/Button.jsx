import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:from-primary-700 hover:to-secondary-600 focus:ring-primary-600 shadow-lg shadow-primary-600/20 hover:shadow-neon',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-600',
    outline: 'border border-border bg-surface text-text-primary hover:border-primary-300 hover:text-primary-700 focus:ring-primary-600',
    ghost: 'text-text-primary hover:bg-surface-2 focus:ring-primary-600',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-60 cursor-not-allowed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};
