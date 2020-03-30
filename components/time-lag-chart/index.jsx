import React, { useState, useEffect, useMemo } from 'react'
import {
  Cell,
  Bar,
  BarChart,
  ReferenceLine,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { classNames } from '@oacore/design/lib/utils'
import { nest } from 'd3-collection'
import { sum, mean } from 'd3-array'

import CustomTooltip from './tooltip'
import styles from './index.module.css'

const customTicks = {
  ...Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].flatMap((i) => [
      [-i * 365, `${-i}y`],
      [i * 365, `${i}y`],
    ])
  ),
  7: '1w',
  31: '1m',
  90: '90d',
}

const aggregationSize = 14

const isInInterval = (groupIndex, dayIndex, groupSize = aggregationSize) =>
  dayIndex >= groupIndex * groupSize &&
  dayIndex <= groupIndex * groupSize + groupSize - 1

const isTick = (groupIndex) =>
  Object.keys(customTicks).some((day) =>
    isInInterval(groupIndex, parseInt(day, 10))
  )

const formatter = (g) => {
  const groupIndex = parseInt(g, 10)
  const el = Object.entries(customTicks).find((e) =>
    isInInterval(groupIndex, parseInt(e[0], 10))
  )
  if (el) return el[1]
  return ''
}

const TimeLagChart = React.memo(
  ({ data, width = '100%', height = 300, ...restProps }) => {
    const [aggregatedData, setAggregatedData] = useState([])

    useEffect(() => {
      const rawIntervalSize =
        data[data.length - 1].depositTimeLag - data[0].depositTimeLag
      const dataMap = new Map(data.map((e) => [e.depositTimeLag, e.worksCount]))
      const normalizedData = []

      for (
        let i = 0;
        i < rawIntervalSize + (rawIntervalSize % aggregationSize);
        i++
      ) {
        const lagIndex = i + data[0].depositTimeLag
        if (dataMap.has(lagIndex)) {
          normalizedData.push({
            depositTimeLag: lagIndex,
            worksCount: dataMap.get(lagIndex),
          })
        } else {
          normalizedData.push({
            depositTimeLag: lagIndex,
            worksCount: 0,
          })
        }
      }

      const aggregation = nest()
        .key((d) => Math.floor(d.depositTimeLag / aggregationSize))
        .rollup((v) => ({
          total: sum(v, (d) => d.worksCount),
          avg: mean(v, (d) => d.worksCount),
        }))
        .entries(normalizedData)

      setAggregatedData(aggregation)
    }, [data])

    const ticks = useMemo(
      () =>
        aggregatedData
          .filter((e) => isTick(parseInt(e.key, 10)))
          .map((e) => e.key),
      [aggregatedData]
    )

    if (aggregatedData.length === 0) return null

    return (
      <ResponsiveContainer width={width} height={height} {...restProps}>
        <BarChart margin={{ bottom: -5 }} data={aggregatedData}>
          <XAxis
            dataKey="key"
            tickLine={false}
            ticks={ticks}
            tickFormatter={formatter}
          />
          <Tooltip
            content={<CustomTooltip aggregationSize={aggregationSize} />}
          />
          <ReferenceLine y={0} className={styles.referenceLine} />
          <Bar dataKey="value.total">
            {aggregatedData.map((entry) => (
              <Cell
                className={classNames
                  .use({
                    'lag-bar': true,
                    'compliant': parseInt(entry.key, 10) * aggregationSize < 90,
                  })
                  .from(styles)
                  .toString()}
                key={entry.key}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
)

export default TimeLagChart
