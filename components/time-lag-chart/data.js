import { scaleSqrt } from 'd3-scale'

export const COMPLIANCE_LIMIT = 90

// converts source DepositTimeLag object to simple [x, y] point
export const toPoints = ({ depositTimeLag, worksCount }) => [
  depositTimeLag,
  worksCount,
]

// converts [x, y] point to actual value
export const toX = ([x]) => x
export const toY = ([, y]) => y

// creates square root scale applicator based on maximal value parameter
// changes second point to scaled and stores original value as third
export const toSqrtScale = (yMax) => {
  const scale = scaleSqrt().domain([0, yMax])
  return ([x, y, ...rest]) => [x, scale(y || 0), ...rest]
}

// For a sorted array of [x, y] pints returns new array,
// where are missing x-values filled with y-values = 0
export const withGaps = (values, [x, y, ...rest]) => {
  const [prevX] = values[values.length - 1] ?? [x - 1]
  values.push(...Array.from(Array(x - prevX - 1), (_, i) => [prevX + i + 1, 0]))
  values.push([x, y, ...rest])
  return values
}

// Groups values of the array to a specific size buckets
export const withBuckets = (size, start = 0) => (buckets, value, index) => {
  if ((index + start) % size === 0 || index === 0) {
    const current = [value]
    buckets.push(current)
  } else {
    const last = buckets[buckets.length - 1]
    last.push(value)
  }

  return buckets
}

// Summarises each bucket
export const toBucketSum = (values) =>
  values.reduce(
    ([xRange, yTotal], [x, y], index) => {
      if (index <= 1) xRange.push(x)
      else xRange[1] = x
      return [xRange, yTotal + y]
    },
    [[], 0]
  )
