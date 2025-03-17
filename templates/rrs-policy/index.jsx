import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import RrsTable from './tables/rrsTable'
import DashboardHeader from '../../components/dashboard-header'
import ShowMoreText from '../../components/showMore'
import StatsCard from '../../components/statsCard/statsCard'
import PdfUploadChecker from '../../components/uploadChecker/PdfUploadChecker'

import rrs from 'texts/rrs-retention'

const RrsPageTemplate = ({
  tag: Tag = 'main',
  className,
  rrsList,
  getRrslistData,
  updateRrsStatus,
  statusUpdate,
  articleAdditionalData,
  getOutputsAdditionalData,
  articleAdditionalDataLoading,
  rrsPdfLoading,
  uploadPdf,
  uploadResults,
  rrsUrl,
  rrsDataLoading,
  billingPlan,
  dataProviderData,
  ...restProps
}) => {
  const [showMore, setShowMore] = useState(false)
  const [checkBillingType, setCheckBillingType] = useState(false)
  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const rrsToReviewList = rrsList.filter(
    (item) => item.validationStatusRRS !== 1 && item.validationStatusRRS !== 2
  )

  useEffect(() => {
    setCheckBillingType(billingPlan?.billingType === 'starting')
  }, [billingPlan])

  return (
    <Tag className={classNames.use(styles.main).join(className)} {...restProps}>
      <DashboardHeader
        title={rrs.title}
        showMore={
          <ShowMoreText
            className={styles.description}
            text={rrs.description || 'N/A'}
            maxLetters={320}
            showMore={showMore}
            toggleShowMore={toggleShowMore}
            textRestyle
          />
        }
      />
      <div className={styles.rrsMainWrapper}>
        <div className={styles.cardsWrapper}>
          <StatsCard
            title={rrs.statsCard.title}
            description={rrs.statsCard.description}
            count={rrsList.length}
            loading={rrsDataLoading}
            actionText={rrs.statsCard.action}
            actionHref={rrsUrl}
            checkBillingType={checkBillingType}
          />
          <StatsCard
            title={rrs.reviewCard.title}
            description={rrs.reviewCard.description}
            count={rrsToReviewList.length}
            loading={rrsDataLoading}
            actionText={rrs.reviewCard.action}
            actionHref="#rrsTable"
            showInfo
            infoText={rrs.reviewCard.info}
            countClassName={styles.inputCount}
          />
          <PdfUploadChecker
            pdfLoading={rrsPdfLoading}
            uploadPdf={uploadPdf}
            uploadResults={uploadResults}
            text={rrs}
            foundSentence={uploadResults.rightsRetentionSentence}
            licenseType={uploadResults.licenceRecognised}
            title="RRS demo checker"
          />
        </div>
        <RrsTable
          rrsDataLoading={rrsDataLoading}
          rrsList={rrsList}
          getRrslistData={getRrslistData}
          updateRrsStatus={updateRrsStatus}
          statusUpdate={statusUpdate}
          articleAdditionalData={articleAdditionalData}
          getOutputsAdditionalData={getOutputsAdditionalData}
          articleAdditionalDataLoading={articleAdditionalDataLoading}
          checkBillingType={checkBillingType}
          rrsUrl={rrsUrl}
          dataProviderData={dataProviderData}
        />
      </div>
    </Tag>
  )
}

export default RrsPageTemplate
