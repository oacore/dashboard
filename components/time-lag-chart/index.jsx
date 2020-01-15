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

import data from './data'

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
const TimeLagChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart margin={{ bottom: -5 }} data={data}>
      <XAxis
        dataKey="depositTimeLag"
        tickLine={false}
        ticks={ticks}
        tickFormatter={formatter}
      />
      <Tooltip />
      <ReferenceLine y={0} stroke="#424242" />
      <Bar dataKey="worksCount">
        {data.map(entry => {
          const color = entry.depositTimeLag <= 90 ? '#5A9216' : '#9E9E9E'
          return <Cell key={entry.depositTimeLag} fill={color} />
        })}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
))

export default TimeLagChart
