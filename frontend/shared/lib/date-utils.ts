import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Checks if a given value is a valid Date object or can be parsed into one.
 */
export function isValidDate(date: any): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return isValid(d);
}

/**
 * Safely parses an ISO string into a Date object.
 * Returns null if the date is invalid.
 */
export function safeParseISO(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  
  // Standardize "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
  const standardized = dateString.includes(" ") && !dateString.includes("T") 
    ? dateString.replace(" ", "T") 
    : dateString;

  try {
    const date = parseISO(standardized);
    if (isValid(date)) return date;
    
    // Fallback to native Date for other formats
    const nativeDate = new Date(dateString);
    return isValid(nativeDate) ? nativeDate : null;
  } catch {
    return null;
  }
}

/**
 * Safely formats a date string or object.
 * Returns a fallback string if the date is invalid.
 */
export function safeFormat(
  date: string | Date | undefined | null,
  formatStr: string,
  options: { fallback?: string; locale?: any } = {}
): string {
  const { fallback = "N/A", locale = vi } = options;

  if (!date) return fallback;

  try {
    const d = typeof date === "string" ? safeParseISO(date) : date;
    if (!d || !isValid(d)) return fallback;
    return format(d as Date, formatStr, { locale });
  } catch {
    return fallback;
  }
}

/**
 * Formats time from an ISO string or Date.
 * Example: "2023-10-27T14:30:00" -> "14:30"
 */
export function formatTime(date: string | Date | undefined | null, fallback = "--:--"): string {
  return safeFormat(date, "HH:mm", { fallback });
}

/**
 * Formats a date to "dd/MM".
 * Example: "2023-10-27T14:30:00" -> "27/10"
 */
export function formatDateShort(date: string | Date | undefined | null, fallback = "N/A"): string {
  return safeFormat(date, "dd/MM", { fallback });
}

/**
 * Combines a sessionDate ("YYYY-MM-DD") and a time string ("HH:mm:ss" or "HH:mm")
 * into a single Date object. Falls back to parsing the time alone if no date is provided.
 * 
 * Example: parseSessionDateTime("2024-04-15", "08:30:00") => Date(2024-04-15T08:30:00)
 */
export function parseSessionDateTime(
  sessionDate: string | undefined | null,
  time: string | undefined | null
): Date | null {
  if (!time) return null;

  // If time is already a full datetime (contains T or a long string with date), parse it directly
  if (time.includes("T") || (time.includes("-") && time.length > 10)) {
    return safeParseISO(time);
  }

  // time is time-only (e.g., "08:30:00" or "08:30")
  if (sessionDate) {
    // Combine date + time into ISO format
    const combined = `${sessionDate}T${time}`;
    return safeParseISO(combined);
  }

  // No sessionDate - cannot determine the full datetime
  return null;
}

/**
 * Formats a session's time field, automatically handling both time-only strings
 * (combined with sessionDate) and full datetime strings.
 */
export function formatSessionTime(
  sessionDate: string | undefined | null,
  time: string | undefined | null,
  fallback = "--:--"
): string {
  const date = parseSessionDateTime(sessionDate, time);
  if (!date || !isValid(date)) return fallback;
  try {
    return format(date, "HH:mm");
  } catch {
    return fallback;
  }
}

/**
 * Formats a session's date for display (day of week, day number, month).
 * Combines sessionDate + time to build a full datetime.
 */
export function formatSessionDate(
  sessionDate: string | undefined | null,
  time: string | undefined | null,
  formatStr: string,
  options: { fallback?: string; locale?: any } = {}
): string {
  const { fallback = "N/A", locale = vi } = options;
  const date = parseSessionDateTime(sessionDate, time);
  if (!date || !isValid(date)) return fallback;
  try {
    return format(date, formatStr, { locale });
  } catch {
    return fallback;
  }
}
