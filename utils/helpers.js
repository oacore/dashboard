export const range = (length, start = 0, step = 1) =>
  Array.from(Array(length), (_, i) => start + i * step)

export const formatNumber = (number, { locale = 'en-GB', ...options } = {}) =>
  new Intl.NumberFormat(locale, options).format(number)

export default {
  range,
}
