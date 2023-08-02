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

const DeduplicationPageTemplate = observer(
  ({
    tag: Tag = 'main',
    className,
    getDeduplicationData,
    duplicateList,
    getDeduplicationInfo,
    duplicateListDetails,
    harvestingStatus,
    getOutputsData,
    outputData,
    getWorksData,
    workData,
    updateWork,
    duplicatesUrl,
    exportUrl,
    billingPlan,
    dataProviderData,
    clearOutputsData,
    ...restProps
  }) => {
    const router = useRouter()

    const [rowData, setRowData] = useState()
    const [showCompareView, setShowCompareView] = useState(false)
    const [checkBillingType, setCheckBillingType] = useState(false)

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

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        <header className={styles.header}>
          <div className={styles.temporaryWrapper}>
            <h1 className={styles.title}>{texts.title}</h1>
            <div className={styles.beta}>BETA</div>
          </div>
          <ShowMoreText
            className={styles.description}
            text={texts.description || 'N/A'}
            maxLetters={320}
          />
        </header>
        <div className={styles.cardsWrapper}>
          <DeduplicationInfoCard
            duplicateList={duplicateList}
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
        />
      </Tag>
    )
  }
)
export default DeduplicationPageTemplate
