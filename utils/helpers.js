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

export default {
  range,
  valueOrDefault,
  formatNumber,
}
