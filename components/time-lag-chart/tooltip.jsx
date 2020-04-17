import React from 'react'

import styles from './index.module.css'

const Tooltip = ({ active, payload, label }) => {
  const index = parseInt(label, 10)
  if (!active) return null

  return (
    <div className={styles.tooltip}>
      {Math.abs(payload[0].value)} works deposited <br />
      {Math.abs(index)} days {index < 0 ? 'before' : 'after'} publication
    </div>
  )
}

export default Tooltip
