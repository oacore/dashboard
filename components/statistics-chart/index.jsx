import React from 'react'
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import CustomTooltip from 'design/tooltip'
import { formatNumber } from 'utils/helpers'

const StatisticsChart = ({
  data,
  className,
  colors,
  width = '100%',
  height = 230,
  labelsPosition = 'top',
  ...restProps
}) => {
  const { name, all, ...dataKeys } = data.length > 0 ? data[0] : {}
  const barKeys = Object.keys(dataKeys)
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={data}
        {...restProps}
        margin={{
          top: 0,
          left: -10,
          right: 0,
          bottom: 0,
        }}
      >
        <XAxis type="category" dataKey="name" tickLine={false} interval={0} />
        <YAxis type="number" hide />
        <CartesianGrid strokeDasharray="3 0" vertical={false} stroke="#eee" />

        <Tooltip content={<CustomTooltip />} />
        {barKeys.map((dataKey, index) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            stackId="1"
            fill={colors[dataKey]}
            isAnimationActive={false}
          >
            {index === barKeys.length - 1 ? (
              <LabelList
                formatter={(value) =>
                  `${formatNumber(value, { notation: 'compact' })}`
                }
                position={labelsPosition === 'inside' ? 'insideTop' : 'top'}
                fill={labelsPosition === 'inside' ? '#fff' : '#222'}
                dataKey={(entry) =>
                  barKeys.reduce((acc, curr) => acc + entry[curr], '')
                }
              />
            ) : null}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default StatisticsChart
