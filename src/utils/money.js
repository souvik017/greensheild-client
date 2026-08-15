export const formatMoney = (value) => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const round2 = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};
