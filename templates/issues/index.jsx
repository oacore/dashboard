import React from 'react'

import styles from './styles.module.css'
import { TableCard, HarvestingOverviewCard, ErrorsOverviewCard } from './cards'
import { valueOrDefault } from '../../utils/helpers'

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
  const totalCount = valueOrDefault(errorsCount + warningsCount, 0)

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <HarvestingOverviewCard
        globalsCount={globalsCount}
        lastHarvestingDate={lastHarvestingDate}
      />
      <ErrorsOverviewCard totalCount={totalCount} errorsCount={errorsCount} />
      {pages && (
        <TableCard
          totalCount={totalCount}
          aggregation={aggregation}
          pages={pages}
        />
      )}
    </Tag>
  )
}

export default IssuesTemplate
