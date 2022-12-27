import React from 'react'

import { withGlobalStore } from 'store'
import DepositComplianceTemplate from 'templates/deposit-compliance'

const DepositCompliance = ({ store: { dataProvider }, ...restProps }) => (
  <DepositComplianceTemplate
    datesUrl={dataProvider?.depositDates?.datesUrl}
    publicReleaseDatesPages={dataProvider?.depositDates?.publicReleaseDates}
    publicationDatesValidate={
      dataProvider?.depositDates?.publicationDatesValidate
    }
    crossDepositLagCsvUrl={dataProvider?.depositDates?.crossDepositLagCsvUrl}
    complianceLevel={dataProvider?.depositDates?.complianceLevel}
    totalCount={dataProvider?.depositDates?.totalCount}
    timeLagData={dataProvider?.depositDates?.timeLagData}
    isRetrieveDepositDatesInProgress={
      dataProvider?.depositDates?.isRetrieveDepositDatesInProgress
    }
    crossDepositLag={dataProvider?.depositDates?.crossDepositLag}
    countryCode={dataProvider?.location?.countryCode}
    dataProviderData={dataProvider}
    {...restProps}
  />
)

export default withGlobalStore(DepositCompliance)
