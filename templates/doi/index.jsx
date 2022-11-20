import React from 'react'

import styles from './styles.module.css'
import { CoverageCard, TableCard } from './cards'

import Title from 'components/title'

const DoiTemplate = ({
  className,
  enrichmentSize,
  doiUrl,
  isExportDisabled,
  doiCount,
  dataProviderName,
  doiRecords,
  totalCount,
  membershipPlan,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <Title>DOI</Title>

    <CoverageCard
      dataProviderName={dataProviderName}
      doiCount={doiCount}
      totalCount={totalCount}
      enrichmentSize={enrichmentSize}
    />

    {doiRecords && (
      <TableCard
        pages={doiRecords}
        exportUrl={doiUrl}
        membershipPlan={membershipPlan}
      />
    )}
  </Tag>
)

export default DoiTemplate
