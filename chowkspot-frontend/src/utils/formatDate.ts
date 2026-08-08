export type DateFormatPreset = 'short' | 'long' | 'datetime' | 'time';

const PRESET_CONFIGS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  short: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
  long: {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  datetime: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
};

/**
 * Centralized formatting utility to handle all date/time strings cleanly across ChowkSpot.
 */
export const formatDate = (
  dateString?: string | Date | null,
  preset: DateFormatPreset = 'short',
  customOptions?: Intl.DateTimeFormatOptions,
): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options = customOptions || PRESET_CONFIGS[preset] || PRESET_CONFIGS.short;

  return new Intl.DateTimeFormat('en-IN', options).format(date);
};
