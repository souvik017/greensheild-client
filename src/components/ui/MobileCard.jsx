export const MobileCard = ({ children }) => (
  <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur transition-colors hover:border-primary-400/40">
    {children}
  </div>
);

export const MobileCardHeader = ({ title, subtitle, badge }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <p className="truncate font-medium text-text-primary">{title}</p>
      {subtitle && <p className="truncate text-sm text-text-secondary">{subtitle}</p>}
    </div>
    {badge && <div className="shrink-0">{badge}</div>}
  </div>
);

export const MobileCardGrid = ({ items }) => (
  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
    {items
      .filter((item) => item.value !== null && item.value !== undefined && item.value !== '')
      .map((item, index) => (
        <div key={index} className="min-w-0">
          <p className="text-xs text-text-muted">{item.label}</p>
          <p className="mt-0.5 truncate text-text-primary">{item.value}</p>
        </div>
      ))}
  </div>
);

export const MobileCardFooter = ({ left, right }) => (
  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
    <span className="text-xs text-text-muted">{left}</span>
    {right && <div className="flex items-center gap-2">{right}</div>}
  </div>
);