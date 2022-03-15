import React from 'react'

import styles from './styles.module.css'

import { formatNumber } from 'utils/helpers'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.text}>
          {payload[0].name} : <b>{formatNumber(payload[0].value)}</b>
        </p>
      </div>
    )
  }

  return null
}
export default CustomTooltip
