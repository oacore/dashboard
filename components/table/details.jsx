import React from 'react'

import styles from './styles.module.css'

const Details = ({ children, ...props }) =>
  children ? (
    <tr className={styles.details} {...props}>
      {children}
    </tr>
  ) : null

export default Details
