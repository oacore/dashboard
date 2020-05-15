import React from 'react'

import { toPoints, withGaps, withBuckets, toBucketSum } from './data'
import TimeLagChart from './chart'

const TimeLagChartController = React.memo(
  ({
    data,
    minX = Number.NEGATIVE_INFINITY,
    maxX = Number.POSITIVE_INFINITY,
    aggregateBy = 10,
    ...restProps
  }) => {
    const points = data
      .map(toPoints)
      .filter(([x]) => x >= minX && x <= maxX)
      .reduce(withGaps, [])

    const zeroIndex = points.findIndex(([x]) => x === 0)
    const aggregatedPoints =
      aggregateBy > 1
        ? points
            .reduce(withBuckets(aggregateBy, zeroIndex), [])
            .map(toBucketSum)
        : points

    return <TimeLagChart data={aggregatedPoints} {...restProps} />
  }
)

export default TimeLagChartController
