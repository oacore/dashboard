import React, { useEffect, useState } from 'react'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import DeduplicationListTable from './deduplicationListTable'
import CompareDuplicates from '../cards/compareDuplicates'

const DeduplicationTableCard = ({
  duplicateData,
  handeAdditionalInfo,
  rowData,
  goBack,
  duplicateDataDetails,
  worksData,
  showCompareView,
  updateWork,
  outputsData,
}) => {
  const [list, setList] = useState([])
  const [compare, setCompare] = useState(true)
  const [worksDataInfo, setWorksDataInfo] = useState([])

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
    const data = await worksData(id)
    setWorksDataInfo(data)
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
          outputsData={outputsData}
          worksDataInfo={worksDataInfo}
        />
      )}
    </Card>
  )
}
export default DeduplicationTableCard
