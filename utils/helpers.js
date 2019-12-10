export const range = (length, start = 0, step = 1) =>
  Array.from(Array(length), (_, i) => start + i * step)

export default {
  range,
}
