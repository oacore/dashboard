import React from 'react'

import { withGlobalStore } from 'store'
import USRNTemplate from 'templates/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => {
  const usrnParams = {
    dataProviderName: dataProvider.name,
    billingPlan: organisation.billingPlan,
    doiCount: dataProvider?.doi?.originCount,
    totalDoiCount: dataProvider?.statistics?.countMetadata,
    countMetadata: dataProvider?.statistics?.countMetadata,
    rioxxTotalCount: dataProvider?.rioxx?.totalCount,
    rioxxPartiallyCompliantCount: dataProvider?.rioxx?.partiallyCompliantCount,
    countFulltext: dataProvider?.statistics?.countFulltext,
    embargoedDocuments:
      dataProvider?.issues?.aggregation?.countByType?.RESTRICTED_ATTACHMENT,
    statisticsIrus: dataProvider?.irus,
    usrnLicense: dataProvider?.usrn?.license,
    usrnVocabulariesCOAR: dataProvider?.usrn?.vocabulariesCOAR,
    usrnDateReportUpdate: dataProvider?.usrn?.dateReportUpdate,
  }
  return <USRNTemplate usrnParams={usrnParams} {...props} />
}

export default withGlobalStore(USRNPage)
