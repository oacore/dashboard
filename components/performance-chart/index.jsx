import React from 'react'
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

import NumericValue from '../numeric-value'
import styles from './styles.css'

const PerformanceChart = ({ value, increase, caption }) => (
  <div className={styles.chartContainer} style={{ marginBottom: -64 + 24 }}>
    <ResponsiveContainer width="100%" height={320 - 64}>
      <RadialBarChart
        innerRadius="100%"
        data={[
          {
            value,
            fill: 'var(--gray-800)',
          },
          increase && {
            value: value + increase,
            fill: 'var(--primary)',
          },
          {
            value: 100,
            fill: '#fff',
          },
        ].filter(truthy => truthy)}
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
