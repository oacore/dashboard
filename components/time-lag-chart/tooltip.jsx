import React from 'react'

import styles from './styles.module.css'

const Tooltip = ({ active, label, data }) => {
  const index = parseInt(label, 10)
  if (!active) return null

  return (
    <div className={styles.tooltip}>
      {Math.abs(data.find((d) => d.depositTimeLag === index)?.worksCount || 0)}{' '}
      works deposited <br />
      {Math.abs(index)} days {index < 0 ? 'before' : 'after'} publication
    </div>
  )
}

export default Tooltip
