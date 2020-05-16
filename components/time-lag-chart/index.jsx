import React from 'react'
import { ResponsiveBar as BarChart } from '@nivo/bar'

// WIP: Assuming that we will or already do use aggregation in the target PR
/* eslint-disable no-unused-vars */

import {
  toPoints,
  toX,
  toY,
  withGaps,
  withBuckets,
  toBucketSum,
  toSqrtScale,
} from './data'

const toDuplicatedY = ([x, y]) => [x, y, y]

const TimeLagChartController = React.memo(
  ({
    data: sourceData,
    minX = Number.NEGATIVE_INFINITY,
    maxX = Number.POSITIVE_INFINITY,
    aggregateBy = 10,
    ...restProps
  }) => {
    const points = sourceData
      .map(toPoints)
      .filter(([x]) => x >= minX && x <= maxX)
    const scaledPoints = points
      .reduce(withGaps, [])
      .map(toDuplicatedY)
      .map(toSqrtScale(Math.max(...points.map(toY))))

    const targetData = scaledPoints.map(
      ([lag, scaledValue, originalValue]) => ({
        lag,
        scaledValue,
        originalValue,
      })
    )

    const zeroIndex = points.findIndex(([x]) => x === 0)
    const aggregatedPoints =
      aggregateBy > 1
        ? points
            .reduce(withBuckets(aggregateBy, zeroIndex), [])
            .map(toBucketSum)
        : points

    return (
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ width: 8 * points.length, height: 300 }}>
          <BarChart
            data={targetData}
            keys={['scaledValue']}
            indexBy="lag"
            padding={0.25}
            tooltip={({ data: d }) => `${d.lag}: ${d.originalValue}`}
            colors={({ indexValue }) => {
              const wrapVar = (color) => `var(--${color})`
              // assuming comparison string to number
              // eslint-disable-next-line eqeqeq
              if (indexValue == 0) return wrapVar('success-dark')
              return wrapVar(indexValue <= 90 ? 'success' : 'gray-500')
            }}
            enableGridX
            gridXValues={scaledPoints.map(toX).filter((x) => x % 30 === 0)}
            enableGridY={false}
            enableLabel={false}
            {...restProps}
          />
        </div>
      </div>
    )
  }
)

export default TimeLagChartController
