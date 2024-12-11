import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'

import styles from '../styles.module.css'

import { formatNumber } from 'utils/helpers'

const CustomYAxisTick = ({ x, y, data, index, checkBillingType }) => {
  const item = data[index]
  const shouldRenderDiv = checkBillingType && ![1, 2, 3].includes(index)

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-210} y={-22} width={190} height={43}>
        {shouldRenderDiv ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#BDBDBD',
            }}
          />
        ) : (
          <div className={styles.iconWrapper}>
            <img src={item.iconH} alt={item.name} />
          </div>
        )}
      </foreignObject>
    </g>
  )
}
const CustomLabel = ({
  x,
  y,
  width,
  value,
  totalOutputCount,
  toggle,
  index,
  checkBillingType,
}) => {
  if (checkBillingType && ![1, 2, 3].includes(index)) return null

  const labelWidth = value.toString().length * 40
  const fitsInside = width > labelWidth
  const displayValue = toggle
    ? `${((value / totalOutputCount) * 100).toFixed(2)}%`
    : formatNumber(value)

  return (
    <g
      transform={`translate(${x + (fitsInside ? width - 10 : width + 10)},${
        y + 25
      })`}
    >
      <text
        className={styles.sdgCountWrapper}
        fill={fitsInside ? '#fff' : '#000'}
        textAnchor={fitsInside ? 'end' : 'start'}
      >
        <tspan>
          <tspan className={styles.sdgCountH}>{displayValue}</tspan>
          <tspan className={styles.sdgDescriptionH}>&nbsp;Papers</tspan>
        </tspan>
      </text>
    </g>
  )
}

const HorizontalChart = ({
  data,
  updatedSdgTypes,
  toggle,
  checkBillingType,
}) => {
  const filteredData = data.filter((item) => item.id !== 'all' && item.iconH)

  const sortedData = [...filteredData].sort(
    (a, b) => b.outputCount - a.outputCount
  )

  const totalOutputCount = updatedSdgTypes.find(
    (sdg) => sdg.id === 'all'
  ).outputCount

  return (
    <ResponsiveContainer width="100%" height={sortedData.length * 50}>
      <BarChart
        layout="vertical"
        data={sortedData}
        margin={{ top: 5, right: 30, left: 165, bottom: 5 }}
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
            <CustomYAxisTick
              x={x}
              y={y}
              data={sortedData}
              index={index}
              checkBillingType={checkBillingType}
            />
          )}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="outputCount" fill="#8884d8">
          <LabelList
            dataKey="outputCount"
            content={
              <CustomLabel
                totalOutputCount={totalOutputCount}
                toggle={toggle}
                checkBillingType={checkBillingType}
              />
            }
          />
          {sortedData.map((entry, index) => (
            <Cell
              /* eslint-disable-next-line react/no-array-index-key */
              key={`cell-${index}`}
              fill={
                checkBillingType && ![1, 2, 3].includes(index)
                  ? '#BDBDBD'
                  : entry.color
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default HorizontalChart
