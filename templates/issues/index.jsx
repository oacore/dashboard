import React from 'react'

import styles from './styles.module.css'
import { TableCard, HarvestingOverviewCard, ErrorsOverviewCard } from './cards'

const IssuesTemplate = ({
  className,
  store,
  harvestingStatus,
  aggregation,
  pages,
  tag: Tag = 'main',
  ...restProps
}) => {
  const { lastHarvestingDate } = harvestingStatus || {}
  const { globalsCount, errorsCount, warningsCount } = aggregation || {}
  const totalCount = errorsCount + warningsCount

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <HarvestingOverviewCard
        globalsCount={globalsCount}
        lastHarvestingDate={lastHarvestingDate}
      />
      <ErrorsOverviewCard totalCount={totalCount} errorsCount={errorsCount} />
      <TableCard totalCount={totalCount} pages={pages} />
    </Tag>
  )
}

export default IssuesTemplate
