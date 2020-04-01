import React from 'react'
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

import NumericValue from '../numeric-value'
import styles from './styles.css'

const PerformanceChart = ({ value, increase, caption }) => (
  <div className={styles.container}>
    <div className={styles.rechartsWrapper}>
      <ResponsiveContainer className={styles.rechartsInner}>
        <RadialBarChart
          innerRadius="100%"
          data={[
            {
              value: Number(value) || 0,
              fill: 'var(--gray-800)',
            },
            increase &&
              Number(value + increase) > 0 &&
              increase > 0 && {
                value: value + increase,
                fill: 'var(--primary)',
              },
            {
              value: 100,
              fill: '#fff',
              background: { fill: 'transparent' },
            },
          ].filter((truthy) => truthy)}
          startAngle={225}
          endAngle={-45}
        >
          <RadialBar
            minAngle={15}
            background={{ fill: 'var(--gray-200)' }}
            clockWise
            dataKey="value"
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
    <NumericValue
      className={styles.label}
      value={value}
      append="%"
      caption={caption}
    />
  </div>
)

export default PerformanceChart
