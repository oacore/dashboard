export const range = (length, start = 0, step = 1) =>
  Array.from(Array(length), (_, i) => start + i * step)

export const valueOrDefault = (value, defaultValue) =>
  value == null ||
  value === Infinity ||
  value === -Infinity ||
  Number.isNaN(value)
    ? defaultValue
    : value

export const formatNumber = (number, { locale = 'en-GB', ...options } = {}) =>
  new Intl.NumberFormat(locale, options).format(number)

const dateTimeFormatCache = new Map()

export const formatDate = (date, options = {}) => {
  const stringOptions = JSON.stringify(options)
  let dateTimeFormat = dateTimeFormatCache.get(stringOptions)
  if (!dateTimeFormat) {
    dateTimeFormat = new Intl.DateTimeFormat('en-GB', options)
    dateTimeFormatCache.set(stringOptions, dateTimeFormat)
  }

  try {
    return dateTimeFormat.format(new Date(date))
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Date in invalid format', date, error)
    return date
  }
}

export default {
  range,
  valueOrDefault,
  formatNumber,
  formatDate,
}
