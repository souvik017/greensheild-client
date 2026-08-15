import React from 'react';

export const ServiceCardSkeleton = () => (
  <div className="rounded-3xl border border-border-60 bg-surface-60 p-6">
    <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer" />
    <div className="mt-5 h-5 w-3/4 rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer" />
    <div className="mt-3 h-4 w-full rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer" />
    <div className="mt-2 h-4 w-2/3 rounded bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="h-16 w-full bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer border-b border-border" />
);

export const StatCardSkeleton = () => (
  <div className="card p-6 h-32 bg-gradient-to-r from-surface-2 via-border to-surface-2 bg-[length:200%_100%] animate-shimmer" />
);