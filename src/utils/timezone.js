import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Convert UTC date to IST
 */
export function utcToIST(utcDate) {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return utcToZonedTime(date, IST_TIMEZONE);
}

/**
 * Format UTC date to IST string
 * @param {string | Date} utcDate - UTC date from backend
 * @param {string} formatStr - Format string (e.g., 'hh:mm a', 'dd MMM yyyy', 'yyyy-MM-dd HH:mm:ss')
 */
export function formatToIST(utcDate, formatStr = 'hh:mm a') {
  const istDate = utcToIST(utcDate);
  return format(istDate, formatStr);
}

/**
 * Format time in 12-hour format with AM/PM
 */
export function formatTimeIST(utcDate) {
  return formatToIST(utcDate, 'hh:mm a');
}

/**
 * Format date in readable format
 */
export function formatDateIST(utcDate) {
  return formatToIST(utcDate, 'dd MMM yyyy');
}

/**
 * Format date and time together
 */
export function formatDateTimeIST(utcDate) {
  return formatToIST(utcDate, 'dd MMM yyyy, hh:mm a');
}
