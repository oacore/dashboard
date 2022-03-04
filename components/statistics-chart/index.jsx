import React from 'react'
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const StatisticsChart = ({
  data,
  className,
  colors,
  width = '100%',
  height = 300,
  ...restProps
}) => {
  const { name, all, ...dataKeys } = data.length > 0 ? data[0] : {}
  const barKeys = Object.keys(dataKeys)
  return (
    <ResponsiveContainer className={className} width={width} height={height}>
      <BarChart data={data} {...restProps}>
        <XAxis type="category" dataKey="name" tickLine={false} interval={0} />
        <YAxis type="number" hide />
        <Tooltip />
        {barKeys.map((dataKey, index) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            stackId="1"
            fill={colors[dataKey]}
            barSize={100}
            barGap={10}
            isAnimationActive={false}
          >
            {index === barKeys.length - 1 ? (
              <LabelList
                position="top"
                fill="inside"
                valueAccessor={(entry) =>
                  barKeys.reduce((acc, curr) => acc + entry[curr], 0)
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
