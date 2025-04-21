export const formatCurrency = (value: number | undefined, currency: string | undefined) => {
  if (value === undefined || currency === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatPercentage = (value: number | undefined) => {
  if (value === undefined) return 'N/A';
  return `${value.toFixed(2)}%`;
};

export const formatLargeNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toString();
};