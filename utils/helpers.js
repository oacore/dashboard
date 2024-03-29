export const range = (length, start = 0, step = 1) =>
  Array.from(Array(length), (_, i) => start + i * step)

export const valueOrDefault = (value, defaultValue) =>
  value == null ||
  value === Infinity ||
  value === -Infinity ||
  Number.isNaN(value)
    ? defaultValue
    : value

export const formatPercent = (number, precision = 2) =>
  `${number.toFixed(precision)}%`

export const getPercent = (
  numberFirst,
  numberSecond,
  defaultValue,
  precision = 2
) => {
  const result = (numberFirst / numberSecond) * 100
  if (result.toString().length >= 4) return defaultValue

  return `${result.toFixed(precision)}%`
}

export const formatNumber = (
  number,
  { locale = 'en-GB', ...restOptions } = {}
) =>
  new Intl.NumberFormat(locale, {
    ...restOptions,
  }).format(number)

export const processTemplate = (template, context) =>
  template.toString().replace(/\{\{\w+\}\}/g, (replacement) => {
    const key = replacement.substr(2, replacement.length - 4)
    if (Object.prototype.hasOwnProperty.call(context, key)) return context[key]
    return replacement
  })

export const patchValue = (text, statistics) => {
  const context = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(statistics)) {
    context[key] =
      typeof value === 'number'
        ? formatNumber(value, {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 0,
          })
        : value
  }
  return processTemplate(text, context)
}

// eslint-disable-next-line consistent-return
export const patchValueFull = (text, statistics) => {
  const context = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(statistics)) {
    context[key] =
      typeof value === 'number'
        ? formatNumber(value, {
            compactDisplay: 'long',
          })
        : value
    return processTemplate(text, context)
  }
}

const dateTimeFormatCache = new Map()

export const formatDate = (date, options = {}) => {
  const textLoading = 'Loading...'
  const period = 1362647499000
  const stringOptions = JSON.stringify(options)
  let dateTimeFormat = dateTimeFormatCache.get(stringOptions)
  if (!dateTimeFormat) {
    dateTimeFormat = new Intl.DateTimeFormat('en-GB', options)
    dateTimeFormatCache.set(stringOptions, dateTimeFormat)
  }

  if (date === 0) return textLoading
  const inputTimestamp = new Date(date).valueOf()
  if (inputTimestamp < period) return textLoading

  try {
    if (date) return dateTimeFormat.format(new Date(date))
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Date in invalid format', date, error)
    return date
  }
  return date
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const isFalsy = (value) => !value

export default {
  range,
  valueOrDefault,
  formatNumber,
  formatDate,
  capitalize,
  patchValue,
  isFalsy,
}
