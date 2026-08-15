export const shortId = (value) => {
  if (!value) return '—';
  const raw = value._id || value;
  return `#${String(raw).slice(-6).toUpperCase()}`;
};
