import React from 'react'

import styles from './styles.module.css'
import { CoverageCard, ExportCard, TableCard } from './cards'

import Title from 'components/title'

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
    <Title>DOI</Title>

    <CoverageCard
      dataProviderName={dataProviderName}
      doiCount={doiCount}
      enrichmentSize={enrichmentSize}
    />
    <ExportCard
      enrichmentSize={enrichmentSize}
      doiUrl={doiUrl}
      isExportDisabled={
        isExportDisabled ||
        doiRecords.error != null ||
        doiRecords.data.length === 0
      }
    />
    <TableCard pages={doiRecords} />
  </Tag>
)

export default DoiTemplate
