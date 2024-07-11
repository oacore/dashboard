import React from 'react'

import styles from './styles.module.css'
import { ProgressSpinner } from '../../design'

const TableLoading = () => (
  <div className={styles.dataSpinnerWrapper}>
    <ProgressSpinner className={styles.spinner} />
    <p className={styles.spinnerText}>
      This may take a while, longer for larger repositories ...
    </p>
  </div>
)

export default TableLoading
