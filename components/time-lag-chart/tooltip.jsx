import React from 'react'

import styles from './index.module.css'

const Tooltip = ({ active, payload, label, aggregationSize }) => {
  const index = parseInt(label, 10) * aggregationSize
  if (!active) return null

  return (
    <div className={styles.tooltip}>
      {Math.abs(payload[0].value)} works deposited in <br />
      {Math.abs(index)} - {Math.abs(index + aggregationSize - 1)} days{' '}
      {index < 0 ? 'before' : 'after'} publication
    </div>
  )
}

export default Tooltip
