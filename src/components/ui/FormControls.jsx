import { forwardRef } from 'react';

const baseControlClass =
  'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20';

const controlClass = (error, extra) =>
  `${baseControlClass} ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${extra || ''}`;

export const Field = ({ label, required, error, children, hint }) => (
  <div>
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
  </div>
);

export const Input = forwardRef(({ error, className, ...props }, ref) => (
  <input ref={ref} className={controlClass(error, className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ error, className, ...props }, ref) => (
  <textarea ref={ref} className={controlClass(error, className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ error, className, children, ...props }, ref) => (
  <select ref={ref} className={controlClass(error, className)} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';
