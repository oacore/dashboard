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

const DepositComplianceTemplate = ({
  className,
  isExportDisabled,
  datesUrl,
  publicReleaseDatesPages,
  publicationDatesValidate,
  crossDepositLagCsvUrL,
  complianceLevel,
  totalCount,
  timeLagData,
  isRetrieveDepositDatesInProgress,
  crossDepositLag,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>Deposit compliance</h1>
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
      crossDepositLagCsvUrL={crossDepositLagCsvUrL}
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
