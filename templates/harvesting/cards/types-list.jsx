import React from 'react'

import TypeCard from './type-card'
import styles from '../styles.module.css'

const TypesList = ({ typesList, issuesByType }) => (
  <ul className={styles.typesList}>
    {typesList.map(
      ({
        actualType,
        title,
        trigger,
        resolution,
        outputsAffectedCount,
        severity,
      }) => (
        <TypeCard
          key={actualType}
          issuesList={issuesByType.get(actualType)}
          title={title}
          trigger={trigger}
          resolution={resolution}
          count={outputsAffectedCount}
          type={severity[0].toUpperCase() + severity.slice(1).toLowerCase()}
        />
      )
    )}
  </ul>
)

export default TypesList
