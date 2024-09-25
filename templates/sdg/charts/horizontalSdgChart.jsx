import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'

import styles from '../styles.module.css'

const CustomYAxisTick = ({ x, y, data, index }) => {
  const item = data[index]
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-220} y={-25} width={200} height={50}>
        <div className={styles.iconWrapper}>
          <img src={item.iconH} alt={item.name} />
        </div>
      </foreignObject>
    </g>
  )
}

const CustomLabel = ({ x, y, width, value }) => (
  <g transform={`translate(${x + width - 10},${y + 25})`}>
    <text className={styles.sdgCountWrapper} fill="#fff" textAnchor="end">
      <tspan>
        <tspan className={styles.sdgCountH}>{value}</tspan>
        <tspan className={styles.sdgDescriptionH}>&nbsp;Papers</tspan>
      </tspan>
    </text>
  </g>
)

const HorizontalChart = ({ data }) => {
  const filteredData = data.filter((item) => item.id !== 'all' && item.iconH)

  const sortedData = [...filteredData].sort(
    (a, b) => b.outputCount - a.outputCount
  )
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={sortedData.length * 50}>
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 5, right: 30, left: 220, bottom: 5 }}
          barSize={50}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'transparent' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={({ x, y, index }) => (
              <CustomYAxisTick x={x} y={y} data={sortedData} index={index} />
            )}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Bar dataKey="outputCount" fill="#8884d8">
            <LabelList dataKey="outputCount" content={<CustomLabel />} />
            {sortedData.map((entry, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HorizontalChart
