import React from 'react'
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

import NumericValue from '../numeric-value'
import styles from './styles.css'

const PerformanceChart = ({ value, caption }) => (
  <div className={styles.chartContainer}>
    <ResponsiveContainer width="100%" height={320 - 64}>
      <RadialBarChart
        innerRadius="95%"
        data={[
          {
            value,
            fill: 'var(--primary)',
          },
          {
            value: 100,
            fill: '#fff',
          },
        ]}
        startAngle={225}
        endAngle={-45}
      >
        <RadialBar minAngle={15} background clockWise dataKey="value" />
      </RadialBarChart>
    </ResponsiveContainer>
    <NumericValue
      className={styles.chartLabel}
      value={value}
      append="%"
      caption={caption}
    />
  </div>
)

export default PerformanceChart
