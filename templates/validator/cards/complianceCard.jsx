import React from 'react'

import styles from '../styles.module.css'

const complianceCard = ({ filterRepositoryData, repositoryData }) => (
  <article className={styles.content}>
    <p className={styles.rioxInfo}>
      There are {repositoryData.compliantRecordBasic.toLocaleString()} records
      fully compliant to RIOXXv2 over{' '}
      {repositoryData.totalRecords.toLocaleString()}. The remanining records are
      affetcted by {filterRepositoryData?.length} issue types.
    </p>
  </article>
)

export default complianceCard
