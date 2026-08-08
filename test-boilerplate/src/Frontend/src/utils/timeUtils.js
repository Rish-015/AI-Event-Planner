/**
 * Formats a 24-hour time string (e.g. "17:00", "09:30") or ISO string into a 12-hour format string (e.g. "05:00 PM", "09:30 AM").
 * If the input string is already formatted (e.g. "5:00 PM"), returns it as-is.
 */
export function formatTo12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '12:00 PM';
  
  const trimmed = timeStr.trim();
  
  // If already contains AM or PM, return as-is
  if (/am|pm/i.test(trimmed)) {
    return trimmed;
  }

  // Match HH:mm or HH:mm:ss
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return trimmed;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Converts a 12-hour time string (e.g. "05:00 PM") back to a 24-hour time string (e.g. "17:00") for HTML time inputs.
 */
export function formatTo24Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '12:00';
  
  const trimmed = timeStr.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return trimmed;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes}`;
}
