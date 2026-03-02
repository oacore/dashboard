const REPORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

const toTimestamp = (value: unknown): number | null => {
  if (value == null) return null;
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.getTime();
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }
  return null;
};

export const formatReportDate = (value: unknown): string => {
  const timestamp = toTimestamp(value);
  if (timestamp == null) return 'no date';
  return new Intl.DateTimeFormat('en-GB', REPORT_DATE_OPTIONS)
    .format(timestamp)
    .replace(/\//g, '.');
};
