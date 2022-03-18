import React from 'react'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  AreaChart as RechartAreaChart,
  Area,
  LabelList,
} from 'recharts'

import CustomTooltip from 'design/tooltip'
import { formatNumber } from 'utils/helpers'

const AreaChart = ({
  data,
  className,
  chartColor = '#EF8237',
  lineColor = chartColor,
  width = '100%',
  height = 230,
  domain,
  labelsPosition = 'top',
  ...restProps
}) => {
  const { name, all, ...dataKeys } = data.length > 0 ? data[0] : {}
  const barKeys = Object.keys(dataKeys)
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartAreaChart
        data={data}
        {...restProps}
        margin={{
          top: 30,
          right: 30,
          left: 30,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.9} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 0" vertical={false} stroke="#eee" />
        <XAxis type="category" axisLine={false} dataKey="name" />
        <YAxis type="number" hide domain={['dataMin', 'dataMax']} />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        {barKeys.map((dataKey, index) => (
          <Area
            key={dataKey}
            isAnimationActive={false}
            type="monotone"
            fill="url(#color)"
            dataKey={dataKey}
            stroke={lineColor}
            fillOpacity={1}
            activeDot={{ r: 4 }}
            dot
          >
            {index === barKeys.length - 1 ? (
              <LabelList
                position={labelsPosition}
                offset={10}
                formatter={(value) =>
                  `${formatNumber(value, { notation: 'compact' })}`
                }
                fill={labelsPosition === 'inside' ? '#fff' : '#222'}
                dataKey={(entry) =>
                  barKeys.reduce((acc, curr) => acc + entry[curr], '')
                }
              />
            ) : null}
          </Area>
        ))}
      </RechartAreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChart
