import React from 'react'
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

const VerticalBarChart = ({
  data,
  dataKey = 'value',
  className,
  width = '100%',
  height = 128,
  ...restProps
}) => (
  <ResponsiveContainer className={className} width={width} height={height}>
    <BarChart data={data} layout="vertical" {...restProps}>
      <XAxis type="number" hide />
      <YAxis type="category" hide />
      <Bar dataKey={dataKey} isAnimationActive={false}>
        <LabelList
          dataKey="caption"
          position="insideLeft"
          fill="#fff"
          offset={16}
        />
        <LabelList
          dataKey="value"
          position="insideRight"
          formatter={(value) => Number(value).toLocaleString('en-GB')}
          fill="#fff"
          offset={16}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

const EnrichmentChart = ({ value, caption, increase }) => {
  const data = [
    increase && {
      caption: 'CORE',
      value: value + increase || 0,
      fill: 'var(--primary)',
    },
    {
      caption,
      value: Number(value) || 0,
      fill: increase ? 'var(--gray-700)' : 'var(--primary)',
    },
  ].filter((truthy) => truthy)

  return <VerticalBarChart data={data} />
}

export default EnrichmentChart
