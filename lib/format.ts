/**
 * Single money formatting utility used across the entire app.
 * No decimals, with commas, proper sign handling.
 */
export function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${formatted}`;
}

/**
 * Format currency for display in setup/review screens.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

/**
 * Parse user money input: strip non-numeric chars, handle dots, limit decimals.
 */
export function parseMoneyInput(input: string): string {
  const cleaned = input.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) {
    return cleaned.replace(/^0+(\d)/, "$1");
  }

  const integerPart =
    cleaned.slice(0, firstDot).replace(/^0+(\d)/, "$1") || "0";
  const decimalPart = cleaned
    .slice(firstDot + 1)
    .replace(/\./g, "")
    .slice(0, 2);

  return decimalPart.length > 0
    ? `${integerPart}.${decimalPart}`
    : `${integerPart}.`;
}
