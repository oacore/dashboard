import React from 'react'
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
import styles from './index.css'

const customTicks = {
  [-365 * 3]: '-3y',
  [-365 * 2]: '-2y',
  [-365]: '-1y',
  [-31]: '-1m',
  [-7]: '-1w',
  0: '0',
  7: '1w',
  31: '1m',
  90: '90d',
  365: '1y',
  [365 * 2]: '2y',
  [365 * 3]: '3y',
}
const aggregationSize = 14

const isInInterval = (group, day) =>
  day >= group * aggregationSize &&
  day <= group * aggregationSize + aggregationSize - 1

const isTick = group =>
  Object.keys(customTicks).some(day => isInInterval(group, parseInt(day, 10)))

const formatter = g => {
  const group = parseInt(g, 10)
  const el = Object.entries(customTicks).find(e =>
    isInInterval(group, parseInt(e[0], 10))
  )
  if (el) return el[1]
  return ''
}

const TimeLagChart = React.memo(({ data }) => {
  const rawIntervalSize =
    data[data.length - 1].depositTimeLag - data[0].depositTimeLag
  const normalizedData = []
  for (
    let i = 0;
    i < rawIntervalSize + (rawIntervalSize % aggregationSize);
    i++
  ) {
    const lagIndex = i + data[0].depositTimeLag
    const el = data.find(e => e.depositTimeLag === lagIndex)
    if (el) normalizedData.push(el)
    else {
      normalizedData.push({
        depositTimeLag: lagIndex,
        worksCount: 0,
      })
    }
  }

  const aggregatedData = nest()
    .key(d => Math.floor(d.depositTimeLag / aggregationSize))
    .rollup(v => ({
      total: sum(v, d => d.worksCount),
      avg: mean(v, d => d.worksCount),
    }))
    .entries(normalizedData)

  const ticks = aggregatedData
    .filter(e => isTick(parseInt(e.key, 10)))
    .map(e => e.key)

  return (
    <ResponsiveContainer width="100%" height={300}>
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
          {aggregatedData.map(entry => (
            <Cell
              className={classNames
                .use({
                  'lag-bar': true,
                  compliant: parseInt(entry.key, 10) * aggregationSize < 90,
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
})

export default TimeLagChart
