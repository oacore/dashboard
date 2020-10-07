import React from 'react'

import styles from './styles.module.css'
import {
  IssuesListCard,
  HarvestingOverviewCard,
  ErrorsOverviewCard,
} from './cards'

import { valueOrDefault } from 'utils/helpers'

const IssuesTemplate = ({
  className,
  harvestingStatus,
  aggregation,
  issuesByType,
  tag: Tag = 'main',
  ...restProps
}) => {
  const { lastHarvestingDate } = harvestingStatus || {}
  const { globalsCount, errorsCount, warningsCount } = aggregation || {}
  const totalCount = valueOrDefault(errorsCount + warningsCount, 0)

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <HarvestingOverviewCard
        globalsCount={globalsCount}
        lastHarvestingDate={lastHarvestingDate}
      />
      <ErrorsOverviewCard totalCount={totalCount} errorsCount={errorsCount} />
      {aggregation && (
        <IssuesListCard
          totalCount={totalCount}
          aggregation={aggregation}
          issuesByType={issuesByType}
        />
      )}
    </Tag>
  )
}

export default IssuesTemplate
