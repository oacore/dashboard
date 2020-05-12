import React from 'react'

import styles from './styles.module.css'
import { CoverageCard, ExportCard, TableCard } from './cards'

const DoiTemplate = ({
  className,
  enrichmentSize,
  doiUrl,
  isExportDisabled,
  doiCount,
  dataProviderName,
  doiRecords,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>DOI</h1>

    <CoverageCard
      dataProviderName={dataProviderName}
      doiCount={doiCount}
      enrichmentSize={enrichmentSize}
    />
    <ExportCard
      enrichmentSize={enrichmentSize}
      doiUrl={doiUrl}
      isExportDisabled={isExportDisabled}
    />
    <TableCard pages={doiRecords} />
  </Tag>
)

export default DoiTemplate
