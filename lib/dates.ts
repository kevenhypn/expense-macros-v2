/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayISO(): string {
  return new Date().toLocaleDateString("en-CA");
}

/**
 * Get the number of days in the month containing the given date.
 */
export function daysInMonth(dateISO: string): number {
  const d = new Date(dateISO);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/**
 * Check if two date strings are in the same YYYY-MM month.
 */
export function isSameMonth(d1: string, d2: string): boolean {
  return d1.substring(0, 7) === d2.substring(0, 7);
}

/**
 * Get month prefix (YYYY-MM) from a date string.
 */
export function getMonthPrefix(dateISO: string): string {
  return dateISO.slice(0, 7);
}

/**
 * Parse a YYYY-MM-DD string into a Date object (local time).
 */
export function parseDate(dateISO: string): Date {
  return new Date(`${dateISO}T00:00:00`);
}

/**
 * Format a date string for display: "Mar 11, 2026"
 */
export function formatDateLabel(dateISO: string): string {
  return parseDate(dateISO).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date string for long display: "March 11, 2026"
 */
export function formatDateLong(dateISO: string): string {
  return parseDate(dateISO).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get the day number from a date string.
 */
export function getDayOfMonth(dateISO: string): number {
  return parseDate(dateISO).getDate();
}

/**
 * Shift a date by N days and return YYYY-MM-DD.
 */
export function shiftDate(dateISO: string, days: number): string {
  const base = parseDate(dateISO);
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next.toLocaleDateString("en-CA");
}

/**
 * Build YYYY-MM-DD for a given day in a month prefix.
 */
export function buildDateISO(monthPrefix: string, day: number): string {
  return `${monthPrefix}-${String(day).padStart(2, "0")}`;
}

/**
 * Get the reset date label: "Resets Apr 1"
 */
export function getResetDateLabel(dateISO: string): string {
  const d = parseDate(dateISO);
  const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return `Resets ${nextMonth.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

/**
 * Convert a Date object to YYYY-MM-DD.
 */
export function dateToISO(date: Date): string {
  return date.toLocaleDateString("en-CA");
}
