export const PageHeader = ({ eyebrow, title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-semibold text-text-primary">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
  </div>
);
