import React from 'react'
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

const ReChartBarChart = ({
  sdgTypes,
  data,
  sdgYearDataLoading,
  visibleColumns,
}) => (
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
              <Tooltip />
              <Legend />
              {sdgTypes
                .filter((sdg) => visibleColumns.includes(sdg.id))
                .map((sdg) => (
                  <Bar key={sdg.id} dataKey={sdg.id} fill={sdg.color}>
                    <LabelList dataKey={sdg.id} position="top" />
                  </Bar>
                ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </div>
)

export default ReChartBarChart
