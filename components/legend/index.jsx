import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'

const Legend = ({ values, className }) => (
  <div className={classNames.use(styles.legends).join(className)}>
    {values.map((entry) => (
      <div className={styles.legend} key={entry.name}>
        <i className={styles.box} style={{ backgroundColor: entry.color }} />
        <span className={styles.caption}>{entry.name}</span>
      </div>
    ))}
  </div>
)

export default Legend
