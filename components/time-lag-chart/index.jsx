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

const formatter = value => {
  switch (value) {
    case -365:
      return '-1y'
    case -31:
      return '-1m'
    case -7:
      return '-1w'
    case 0:
      return '0'
    case 7:
      return '1w'
    case 31:
      return '1m'
    case 90:
      return '90d'
    case 365:
      return '1y'
    case 365 * 2:
      return '2y'
    case 365 * 3:
      return '3y'
    default:
      return `${value}`
  }
}

const ticks = [-365, -31, -7, 0, 7, 31, 90, 365]
const aggregationSize = 14
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
