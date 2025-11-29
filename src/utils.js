export const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

export const calculateTotalPrice = (priceBreakdown) => {
  const { basePrice, tax, hostFee, handlingFee } = priceBreakdown;
  return basePrice + tax + hostFee + handlingFee;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};