export const range = (length: number, start = 0, step = 1): number[] =>
  Array.from(Array(length), (_, i) => start + i * step)

export const valueOrDefault = (value: number | undefined, defaultValue: string): string | number =>
  value == null ||
    value === Infinity ||
    value === -Infinity ||
    Number.isNaN(value as number)
    ? defaultValue
    : value

export const formatPercent = (number: number, precision = 2): string =>
  `${number.toFixed(precision)}%`

export const getPercent = (
  numberFirst: number,
  numberSecond: number,
  defaultValue: string,
  precision = 2
): string => {
  const result = (numberFirst / numberSecond) * 100
  if (result.toString().length >= 4) return defaultValue

  return `${result.toFixed(precision)}%`
}

export const formatNumber = (
  number: number,
  { locale = 'en-GB', ...restOptions }: Intl.NumberFormatOptions & { locale?: string } = {}
): string =>
  new Intl.NumberFormat(locale, {
    ...restOptions,
  }).format(number)

export const processTemplate = (
  template: string,
  context: Record<string, string | number>
): string =>
  template.toString().replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(context, key)) return String(context[key]);
    return match;
  });

export const patchValue = (
  text: string,
  statistics: Record<string, string | number>
): string => {
  const context: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(statistics)) {
    context[key] =
      typeof value === 'number'
        ? formatNumber(value, {
          notation: 'compact',
          compactDisplay: 'short',
          maximumFractionDigits: 0,
        })
        : value;
  }
  return processTemplate(text, context);
};

export const patchValueFull = (
  text: string,
  statistics: Record<string, string | number>
): string => {
  const context: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(statistics)) {
    context[key] =
      typeof value === 'number'
        ? formatNumber(value, {
          compactDisplay: 'long',
        })
        : value;
  }
  return processTemplate(text, context);
};

const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>()

export const formatDate = (
  date: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const textLoading = 'Loading...'
  const period = 1362647499000
  const stringOptions = JSON.stringify(options)
  let dateTimeFormat = dateTimeFormatCache.get(stringOptions)
  if (!dateTimeFormat) {
    dateTimeFormat = new Intl.DateTimeFormat('en-GB', options)
    dateTimeFormatCache.set(stringOptions, dateTimeFormat)
  }

  if (date === 0) return textLoading
  const inputTimestamp = new Date(date as string | number | Date).valueOf()
  if (inputTimestamp < period) return textLoading

  try {
    if (date) return dateTimeFormat.format(new Date(date as string | number | Date))
  } catch (error) {
    if (import.meta.env.DEV)
      console.error('Date in invalid format', date, error)
    return String(date)
  }
  return String(date)
}

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const isFalsy = (value: unknown): boolean => !value

export const scrollToSection = (
  ref: React.RefObject<HTMLElement | null>,
  headerHeight: number = 56
): void => {
  if (ref.current) {
    const elementTop = ref.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

export default {
  range,
  valueOrDefault,
  formatNumber,
  formatDate,
  capitalize,
  patchValue,
  isFalsy,
  scrollToSection,
}

