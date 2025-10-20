import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import NumericValue from '../numeric-value'
import styles from './styles.module.css'

import { valueOrDefault } from 'utils/helpers'
import CustomTooltip from 'design/tooltip'

const PerformanceChart = ({
  value,
  rounded = false,
  caption,
  values,
  className,
  minHeight = 300,
  stroke = '#e0e0e0',
  maxHeight = minHeight,
  valueSize = 'middle',
}) => (
  <div className={classNames.use(styles.container).join(className)}>
    <ResponsiveContainer
      className={styles.rechartsInner}
      maxHeight={maxHeight}
      minHeight={minHeight}
    >
      <PieChart>
        <Pie
          isAnimationActive={false}
          stroke={stroke}
          data={values}
          startAngle={rounded ? 270 : 225}
          endAngle={rounded ? -135 : -45}
          innerRadius="90%"
          outerRadius="100%"
          paddingAngle={0}
          dataKey="value"
        >
          {values.map((entry) => (
            <Cell key={`cell-${entry}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip position={{ x: 50, y: -25 }} content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>

    {value !== undefined && (
      <NumericValue
        className={styles.label}
        value={valueOrDefault(value, 'Loading...')}
        append="%"
        size={valueSize}
        caption={caption}
        maximumFractionDigits={0}
        bold
      />
    )}
  </div>
)

export default PerformanceChart
