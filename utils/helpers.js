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

// TODO: Taken from @oacore/design
export const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9)

export const KEYS = {
  ESC: 27,
  ENTER: 13,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}

export default {
  KEYS,
  generateId,
  range,
  valueOrDefault,
  formatNumber,
}
