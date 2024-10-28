import React, { useContext } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'

import styles from '../styles.module.css'
import { GlobalContext } from '../../../store'

import { formatNumber } from 'utils/helpers'

const ReChartBarChart = ({
  sdgTypes,
  updatedSdgTypes,
  data,
  sdgYearDataLoading,
  visibleColumns,
  toggle,
}) => {
  const totalOutputCount = updatedSdgTypes.find(
    (sdg) => sdg.id === 'all'
  ).outputCount

  const formatLabel = (value) => {
    if (toggle) return `${((value / totalOutputCount) * 100).toFixed(2)}%`

    return formatNumber(value)
  }

  const renderTooltip = ({ payload, label }) => {
    if (!payload || !payload.length) return null

    const { ...globalStore } = useContext(GlobalContext)
    const globalCountMetadata =
      globalStore.dataProvider?.statistics?.countMetadata || 1

    return (
      <div className={styles.barTooltip}>
        <p>{label}</p>
        {payload.map((entry, index) => {
          const { value, color } = entry
          if (toggle) {
            const firstPercentage = (
              (value / globalCountMetadata) *
              100
            ).toFixed(2)
            const secondPercentage = ((value / totalOutputCount) * 100).toFixed(
              2
            )
            return (
              // eslint-disable-next-line react/no-array-index-key
              <p key={`item-${index}`} style={{ color }}>
                {entry.name} (proportion of all papers with SDG):{' '}
                {firstPercentage}%
                <br />
                {entry.name} (percentage of all papers): {secondPercentage}%
              </p>
            )
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <p key={`item-${index}`} style={{ color }}>
              {entry.name}: {formatNumber(value)}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.innerChartWrapper}>
        <div style={{ width: '100%', height: 400 }}>
          {sdgYearDataLoading ? (
            <div className={styles.loadingBarContainer}>
              {Array.from({ length: 10 }).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className={styles.loadingBar} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderTooltip} />
                <Legend />
                {sdgTypes
                  .filter((sdg) => visibleColumns.includes(sdg.id))
                  .map((sdg) => (
                    <Bar key={sdg.id} dataKey={sdg.id} fill={sdg.color}>
                      <LabelList
                        dataKey={sdg.id}
                        position="top"
                        formatter={formatLabel}
                      />
                    </Bar>
                  ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReChartBarChart
