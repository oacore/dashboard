import React from 'react'

import TypeCard from './type-card'
import styles from '../styles.module.css'

const TypesList = ({ typesList, issuesByType }) => (
  <ul className={styles.typesList}>
    {typesList.map(
      ({
        actualType,
        title,
        description,
        resolution,
        outputsAffectedCount,
        severity,
        hidden,
      }) => (
        <TypeCard
          key={actualType}
          hidden={hidden}
          issuesList={issuesByType.get(actualType)}
          title={title}
          description={description}
          resolution={resolution}
          count={outputsAffectedCount}
          type={severity[0].toUpperCase() + severity.slice(1).toLowerCase()}
        />
      )
    )}
  </ul>
)

export default TypesList
