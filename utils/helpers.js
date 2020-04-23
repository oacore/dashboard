export const range = (length, start = 0, step = 1) =>
  Array.from(Array(length), (_, i) => start + i * step)

export const formatNumber = (number) =>
  new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 3 }).format(number)

export default {
  range,
}
