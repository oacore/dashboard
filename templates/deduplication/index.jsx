// templates/deduplication/index.jsx
import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import DeduplicationInfoCard from './cards/deduplicationInfo'
import DeduplicationStatistics from './cards/deduplicationStatistics'
import DeduplicationTableCard from './tables/deduplicationTables'
import texts from '../../texts/deduplication/deduplication.yml'
import ShowMoreText from '../../components/showMore'
import DashboardHeader from '../../components/dashboard-header'

const DeduplicationPageTemplate = observer(
  ({
    tag: Tag = 'main',
    className,
    getDeduplicationData,
    duplicateList,
    getDeduplicationInfo,
    duplicateListDetails,
    harvestingStatus,
    harvestingError,
    getOutputsData,
    outputData,
    getWorksData,
    workData,
    updateWork,
    duplicatesUrl,
    exportUrl,
    billingPlan,
    dataProviderData,
    duplicateDataLoading,
    clearOutputsData,
    ...restProps
  }) => {
    const router = useRouter()

    const [rowData, setRowData] = useState()
    const [showCompareView, setShowCompareView] = useState(false)
    const [checkBillingType, setCheckBillingType] = useState(false)
    const [showMore, setShowMore] = useState(false)

    const id = router.query['data-provider-id']

    useEffect(() => {
      getDeduplicationData(id)
    }, [id])

    const handeAdditionalInfo = async (row) => {
      await getDeduplicationInfo(row.workId)
      setRowData(row)
      setShowCompareView(true)
    }

    useEffect(() => {
      setCheckBillingType(billingPlan?.billingType === 'starting')
    }, [billingPlan])

    const goBack = () => {
      setShowCompareView(false)
      clearOutputsData()
    }

    const toggleShowMore = () => {
      setShowMore(!showMore)
    }

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        <DashboardHeader
          title={texts.title}
          identifier="BETA"
          showMore={
            <ShowMoreText
              className={styles.description}
              text={texts.description || 'N/A'}
              maxLetters={320}
              showMore={showMore}
              toggleShowMore={toggleShowMore}
              textRestyle
            />
          }
        />
        <div className={styles.cardsWrapper}>
          <DeduplicationInfoCard
            harvestingError={harvestingError}
            harvestingStatus={harvestingStatus}
          />
          <DeduplicationStatistics
            duplicateList={duplicateList}
            duplicatesUrl={duplicatesUrl}
            checkBillingType={checkBillingType}
          />
        </div>
        <DeduplicationTableCard
          duplicateData={duplicateList}
          duplicateDataDetails={duplicateListDetails}
          handeAdditionalInfo={handeAdditionalInfo}
          rowData={rowData}
          goBack={goBack}
          getWorksData={getWorksData}
          workData={workData}
          getOutputsData={getOutputsData}
          outputData={outputData}
          updateWork={updateWork}
          getDeduplicationInfo={getDeduplicationInfo}
          showCompareView={showCompareView}
          setShowCompareView={setShowCompareView}
          duplicatesUrl={duplicatesUrl}
          exportUrl={exportUrl}
          checkBillingType={checkBillingType}
          dataProviderData={dataProviderData}
          duplicateDataLoading={duplicateDataLoading}
        />
      </Tag>
    )
  }
)
export default DeduplicationPageTemplate
