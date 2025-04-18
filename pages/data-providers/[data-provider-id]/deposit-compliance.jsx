import React from 'react'

import { withGlobalStore } from 'store'
import DepositComplianceTemplate from 'templates/deposit-compliance'

const DepositCompliance = ({
  store: { dataProvider, organisation },
  ...restProps
}) => (
  <DepositComplianceTemplate
    datesUrl={dataProvider?.depositDates?.datesUrl}
    publicReleaseDatesPages={dataProvider?.depositDates?.publicReleaseDates}
    publicReleaseDatesError={
      dataProvider?.depositDates?.publicReleaseDatesError
    }
    isPublicReleaseDatesInProgress={
      dataProvider?.depositDates?.isPublicReleaseDatesInProgress
    }
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
    billingPlan={organisation.billingPlan}
    {...restProps}
  />
)

export default withGlobalStore(DepositCompliance)
