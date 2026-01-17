export const formatNumberWithDecimals = (
  value: number | string,
  decimals = 2
): string => {
  const num = Number(value);
  if (isNaN(num)) return "0";

  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
