import React from 'react'

import styles from './styles.module.css'
import { CoverageCard, TableCard } from './cards'
import AccessPlaceholder from '../../components/access-placeholder/AccessPlaceholder'
import RouteGuard from '../../utils/allowedRouteGuards'

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
  billingPlan,
  tag: Tag = 'main',
  ...restProps
}) => {
  const checkBillingType = billingPlan?.billingType === 'sustaining'
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
        <AccessPlaceholder
          dataProviderData={dataProviderData}
          screenHeight
          description="This feature is available only for Sustaining member"
        />
      )}
    </Tag>
  )
}

export default RouteGuard(DoiTemplate)
