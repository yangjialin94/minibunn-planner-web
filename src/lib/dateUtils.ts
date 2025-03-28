import { format } from "date-fns";

/**
 * Local date
 * Date
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Local date
 * Mar 28, 2025, 6:38 PM
 */
export function formatDateLocal(date: Date): string {
  return format(date, "MMM dd, yyyy, h:mm a");
}

/**
 * Local date
 * 2025-08-15
 */
export function formatDateLocalNoTime(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
