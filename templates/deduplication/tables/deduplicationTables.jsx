import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import DeduplicationListTable from './deduplicationListTable'
import CompareDuplicates from '../cards/compareDuplicates'

const DeduplicationTableCard = observer(
  ({
    duplicateData,
    handeAdditionalInfo,
    rowData,
    goBack,
    duplicateDataDetails,
    getWorksData,
    workData,
    showCompareView,
    updateWork,
    getDeduplicationInfo,
    getOutputsData,
    outputData,
    duplicatesUrl,
    exportUrl,
    checkBillingType,
    dataProviderData,
  }) => {
    const [list, setList] = useState([])
    const [compare, setCompare] = useState(true)

    useEffect(() => {
      if (duplicateData?.duplicateList) {
        const values = Object.values(duplicateData.duplicateList)
        setList(values)
      } else setList([])
    }, [duplicateData])

    const combinedArray =
      Array.isArray(duplicateDataDetails) &&
      rowData?.duplicates?.map((obj, index) => ({
        ...obj,
        ...duplicateDataDetails[index],
      }))

    const handleWorksData = async (id) => {
      await getWorksData(id)
    }

    const handleButtonToggle = () => {
      setCompare(!compare)
      handleWorksData(rowData.workId)
    }

    return (
      <Card
        id="deposit-dates-card"
        className={styles.deduplicationTable}
        tag="section"
      >
        {!showCompareView ? (
          <DeduplicationListTable
            list={list}
            handeAdditionalInfo={handeAdditionalInfo}
            duplicatesUrl={duplicatesUrl}
            exportUrl={exportUrl}
            checkBillingType={checkBillingType}
            dataProviderData={dataProviderData}
          />
        ) : (
          <CompareDuplicates
            goBack={goBack}
            handleButtonToggle={handleButtonToggle}
            compare={compare}
            setCompare={setCompare}
            rowData={rowData}
            combinedArray={combinedArray}
            updateWork={updateWork}
            getDeduplicationInfo={getDeduplicationInfo}
            getOutputsData={getOutputsData}
            outputData={outputData}
            worksDataInfo={workData}
          />
        )}
      </Card>
    )
  }
)
export default DeduplicationTableCard
