import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { valueOrDefault } from 'utils/helpers'
import NumericValue from 'components/numeric-value'
import PerformanceChart from 'components/performance-chart'

const FullTextsProgressChart = ({
  value,
  chartValues,
  caption,
  fullTextCount,
  className,
}) => (
  <div
    className={classNames
      .use(styles.infoCardChart, styles.infoBox)
      .join(className)}
  >
    <PerformanceChart
      minHeight={110}
      rounded
      className={styles.infoChart}
      values={chartValues}
      value={value}
      valueSize="extra-small"
    />
    <NumericValue
      className={styles.label}
      value={valueOrDefault(fullTextCount, 'Loading...')}
      size="extra-small"
      caption={caption}
    />
  </div>
)

export default FullTextsProgressChart
