import React from 'react'

import styles from './styles.module.css'

const Legend = ({ values }) => (
  <div className={styles.legends}>
    {values.map((entry) => (
      <div className={styles.legend}>
        <i className={styles.box} style={{ backgroundColor: entry.color }} />
        <span className={styles.caption}>{entry.name}</span>
      </div>
    ))}
  </div>
)

export default Legend
