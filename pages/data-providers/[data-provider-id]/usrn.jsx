import React from 'react'

import { withGlobalStore } from 'store'
import { USRNTemplateActivated, USRNTemplateDeactivated } from 'templates/usrn'
import * as texts from 'texts/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => {
  const isUSRNActivated =
    Object.values(texts.status.usrnListDataProvider).indexOf(dataProvider?.id) >
    -1

  if (!isUSRNActivated) return <USRNTemplateDeactivated {...props} />

  const formattedDateReport = dataProvider?.usrn?.dateReportUpdate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(new Date(dataProvider?.usrn?.dateReportUpdate * 1000))
    : null

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
    usrnDateReportUpdate: formattedDateReport,
  }
  return <USRNTemplateActivated usrnParams={usrnParams} {...props} />
}

export default withGlobalStore(USRNPage)
