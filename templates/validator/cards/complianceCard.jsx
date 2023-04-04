import React from 'react'

import styles from '../styles.module.css'
import table from '../../../components/upload/assets/rioxTable.svg'
import founds from '../../../components/upload/assets/rioxFounds.svg'

const complianceCard = () => (
  <article className={styles.content}>
    <div className={styles.inner}>
      <div className={styles.soon}>
        <h5>Coming soon.</h5>
        <p className={styles.rioxInfo}>
          This feature is still under development.
        </p>
      </div>
      <div className={styles.imageWrapper}>
        <img className={styles.rioxImage} src={table} alt="table" />
        <img className={styles.rioxImage} src={founds} alt="founds" />
      </div>
    </div>
  </article>
)

export default complianceCard
