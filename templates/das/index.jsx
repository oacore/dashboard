import React, { useContext, useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import ShowMoreText from '../../components/showMore'
import StatsCard from '../../components/statsCard/statsCard'
import DasTable from './tables/DasTable'
import PdfUploadChecker from '../../components/uploadChecker/PdfUploadChecker'
import { GlobalContext } from '../../store'

import dasText from 'texts/das'

const DasPageTemplate = observer(
  ({
    tag: Tag = 'main',
    className,
    dasList,
    statusUpdate,
    articleAdditionalData,
    getOutputsAdditionalData,
    articleAdditionalDataLoading,
    billingPlan,
    dataProviderData,
    ...restProps
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [showMore, setShowMore] = useState(false)
    const [checkBillingType, setCheckBillingType] = useState(false)
    const toggleShowMore = () => {
      setShowMore(!showMore)
    }

    const dasToReviewList = dasList.filter(
      (item) =>
        item.validationStatusDataAccess !== 1 &&
        item.validationStatusDataAccess !== 2
    )

    useEffect(() => {
      setCheckBillingType(billingPlan?.billingType === 'starting')
    }, [billingPlan])

    useEffect(() => {
      globalStore.dataProvider.getDasListData(globalStore.dataProvider.id)
    }, [globalStore.dataProvider.id])

    return (
      <Tag
        className={classNames.use(styles.main).join(className)}
        {...restProps}
      >
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
              count={dasList.length}
              loading={globalStore.dataProvider.dasDataLoading}
              actionText={dasText.statsCard.action}
              actionHref={globalStore.dataProvider?.dasUrl}
              checkBillingType={checkBillingType}
            />
            <StatsCard
              title={dasText.reviewCard.title}
              description={dasText.reviewCard.description}
              count={dasToReviewList.length}
              loading={globalStore.dataProvider.dasDataLoading}
              actionText={dasText.reviewCard.action}
              actionHref="#dasTable"
              showInfo
              infoText={dasText.reviewCard.info}
              countClassName={styles.inputCount}
            />
            <PdfUploadChecker
              pdfLoading={globalStore.dataProvider.dasPdfLoading}
              uploadPdf={globalStore.dataProvider.uploadDasPdf}
              uploadResults={globalStore.dataProvider.uploadDasResults}
              text={dasText}
              title="Data Availability Statement demo checker"
            />
          </div>
          <DasTable
            dataLoading={globalStore.dataProvider.dasDataLoading}
            dasList={dasList}
            updateDasStatus={globalStore.dataProvider.updateDasStatus}
            statusUpdate={globalStore.dataProvider.dasStatusUpdate}
            articleAdditionalData={articleAdditionalData}
            getOutputsAdditionalData={getOutputsAdditionalData}
            articleAdditionalDataLoading={articleAdditionalDataLoading}
            checkBillingType={checkBillingType}
            dasUrl={globalStore.dataProvider?.dasUrl}
            dataProviderData={dataProviderData}
          />
        </div>
      </Tag>
    )
  }
)

export default DasPageTemplate
