import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import NumericValue from '../numeric-value'
import styles from './styles.module.css'

const PerformanceChart = ({ value, caption, values, className }) => (
  <div className={classNames.use(styles.container).join(className)}>
    <ResponsiveContainer className={styles.rechartsInner} minHeight={300}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          stroke="#e0e0e0"
          data={values}
          startAngle={225}
          endAngle={-45}
          innerRadius="90%"
          outerRadius="100%"
          paddingAngle={0}
          dataKey="value"
        >
          {values.map((entry) => (
            <Cell key={`cell-${entry}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          wrapperStyle={{
            zIndex: 10000,
            padding: '0',
          }}
          itemStyle={{
            padding: '0.2rem',
          }}
          contentStyle={{
            padding: '0',
            backgroundColor: '#e0e0e0',
            border: 'none',
            boxShadow: ' 0px 5px 25px 5px rgba(112,112,112,0.51)',
          }}
          labelStyle={{}}
        />
      </PieChart>
    </ResponsiveContainer>
    <NumericValue
      className={styles.label}
      value={value}
      append="%"
      caption={caption}
    />
  </div>
)

export default PerformanceChart
