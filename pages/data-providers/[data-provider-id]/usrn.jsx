import React from 'react'

import { withGlobalStore } from 'store'
import { USRNTemplateActivated } from 'templates/usrn'

const USRNPage = ({ store: { dataProvider, organisation }, ...props }) => {
  const formattedDateReport = dataProvider?.usrn?.dateReportUpdate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(new Date(dataProvider?.usrn?.dateReportUpdate * 1000))
    : null

  const issueAggregation = dataProvider?.issues?.aggregation
  const issueRestrictedAttachment =
    issueAggregation?.countByType?.RESTRICTED_ATTACHMENT ?? null

  const usrnParams = {
    template: 'usrn',
    dataProviderId: dataProvider.id,
    dataProviderName: dataProvider.name,
    billingPlan: organisation.billingPlan,
    doiCount: dataProvider?.doi?.originCount,
    totalDoiCount: dataProvider?.statistics?.countMetadata,
    countMetadata: dataProvider?.statistics?.countMetadata,
    rioxxTotalCount: dataProvider?.rioxx?.totalCount,
    rioxxPartiallyCompliantCount: dataProvider?.rioxx?.partiallyCompliantCount,
    countFulltext: dataProvider?.statistics?.countFulltext,
    embargoedDocuments: issueRestrictedAttachment,
    statisticsIrus: dataProvider?.irus,
    usrnLicense: dataProvider?.usrn?.license,
    usrnVocabulariesCOAR: dataProvider?.usrn?.vocabulariesCOAR,
    usrnDateReportUpdate: formattedDateReport,
    supportsBetterMetadata: dataProvider?.usrn?.supportsBetterMetadata,
    supportSignposting: dataProvider?.usrn?.supportSignposting,
    rorId: dataProvider?.rorData?.rorId,
  }
  return <USRNTemplateActivated usrnParams={usrnParams} {...props} />
}

export default withGlobalStore(USRNPage)
