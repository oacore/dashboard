import React from 'react'

import styles from './styles.module.css'
import {
  TableCard,
  PublicationsDatesCard,
  DataOverviewCard,
  CrossRepositoryCheckRedirectCard,
  DepositTimeLagCard,
  CrossRepositoryCheckCard,
} from './cards'

import Title from 'components/title'

const DepositComplianceTemplate = ({
  className,
  isExportDisabled,
  datesUrl,
  publicReleaseDatesPages,
  publicationDatesValidate,
  crossDepositLagCsvUrl,
  complianceLevel,
  totalCount,
  timeLagData,
  isRetrieveDepositDatesInProgress,
  crossDepositLag,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <Title>Deposit compliance</Title>
    <DataOverviewCard
      totalCount={totalCount}
      complianceLevel={complianceLevel}
    />
    <CrossRepositoryCheckRedirectCard
      possibleBonusCount={crossDepositLag?.possibleBonusCount}
    />
    <DepositTimeLagCard
      timeLagData={timeLagData}
      isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
    />
    <CrossRepositoryCheckCard
      crossDepositLag={crossDepositLag}
      crossDepositLagCsvUrl={crossDepositLagCsvUrl}
    />

    <PublicationsDatesCard
      fullCount={publicationDatesValidate?.fullCount}
      partialCount={publicationDatesValidate?.partialCount}
      noneCount={publicationDatesValidate?.noneCount}
    />
    <TableCard
      isExportDisabled={isExportDisabled}
      publicReleaseDatesPages={publicReleaseDatesPages}
      datesUrl={datesUrl}
    />
  </Tag>
)

export default DepositComplianceTemplate
