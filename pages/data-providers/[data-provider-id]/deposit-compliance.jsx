import React from 'react'

import { withGlobalStore } from 'store'
import DepositComplianceTemplate from 'templates/deposit-compliance'

const DepositCompliance = ({ store, ...restProps }) => (
  <DepositComplianceTemplate
    isExportDisabled={store.depositDates.isExportDisabled}
    datesUrl={store.depositDates.datesUrl}
    publicReleaseDatesPages={store.depositDates.publicReleaseDates}
    publicationDatesValidate={store.depositDates.publicationDatesValidate}
    crossDepositLagCsvUrl={store.depositDates.crossDepositLagCsvUrl}
    complianceLevel={store.depositDates.complianceLevel}
    totalCount={store.depositDates.totalCount}
    timeLagData={store.depositDates.timeLagData}
    isRetrieveDepositDatesInProgress={
      store.depositDates.isRetrieveDepositDatesInProgress
    }
    crossDepositLag={store.depositDates.crossDepositLag}
    countryCode={store.dataProvider?.location?.countryCode}
    {...restProps}
  />
)

export default withGlobalStore(DepositCompliance)
