import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import ShowMoreText from '../../components/showMore'
import StatsCard from '../../components/statsCard/statsCard'
import DasTable from './tables/DasTable'
import PdfUploadChecker from '../../components/uploadChecker/PdfUploadChecker'

import dasText from 'texts/das'

const DasPageTemplate = ({
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
        title={dasText.title}
        showMore={
          <ShowMoreText
            className={styles.description}
            text={dasText.description || 'N/A'}
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
            title={dasText.statsCard.title}
            description={dasText.statsCard.description}
            count={rrsList.length}
            loading={rrsDataLoading}
            actionText={dasText.statsCard.action}
            actionHref={rrsUrl}
            checkBillingType={checkBillingType}
          />
          <StatsCard
            title={dasText.reviewCard.title}
            description={dasText.reviewCard.description}
            count={rrsToReviewList.length}
            loading={rrsDataLoading}
            actionText={dasText.reviewCard.action}
            actionHref="#rrsTable"
            showInfo
            infoText={dasText.reviewCard.info}
            countClassName={styles.inputCount}
          />
          <PdfUploadChecker
            rrsPdfLoading={rrsPdfLoading}
            uploadPdf={uploadPdf}
            uploadResults={uploadResults}
            text={dasText}
            title="Data Availability Statement demo checker"
          />
        </div>
        <DasTable
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

export default DasPageTemplate
