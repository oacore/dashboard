import React from 'react'

import styles from './styles.module.css'
import { CoverageCard, TableCard } from './cards'
import AccessPlaceholder from '../../components/access-placeholder/AccessPlaceholder'
import { checkType } from '../../utils/helpers'

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
  dataProviderData,
  tag: Tag = 'main',
  ...restProps
}) => {
  const memberType = checkType(dataProviderData.id, dataProviderData)
  const checkBillingType = memberType?.billing_type === 'sustaining'

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      {checkBillingType ? (
        <>
          <Title>DOI</Title>
          <CoverageCard
            dataProviderName={dataProviderName}
            doiCount={doiCount}
            totalCount={totalCount}
            enrichmentSize={enrichmentSize}
          />
          {doiRecords && <TableCard pages={doiRecords} exportUrl={doiUrl} />}
        </>
      ) : (
        <AccessPlaceholder dataProviderData={dataProviderData} screenHeight />
      )}
    </Tag>
  )
}

export default DoiTemplate
