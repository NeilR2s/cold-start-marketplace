export { cn } from './lib/utils';

export interface PriceBreakdown {
  basePrice: number;
  tax: number;
  hostFee: number;
  handlingFee: number;
}

export const formatPHP = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

export const calculateTotalPrice = (priceBreakdown: PriceBreakdown): number => {
  const { basePrice, tax, hostFee, handlingFee } = priceBreakdown;
  return basePrice + tax + hostFee + handlingFee;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};
