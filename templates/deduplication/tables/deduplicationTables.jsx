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
}) => {
  const [list, setList] = useState([])
  const [compare, setCompare] = useState(true)
  // eslint-disable-next-line no-unused-vars
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
      ...rowData?.duplicates[index],
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
      {Object.keys(duplicateDataDetails).length === 0 ? (
        <DeduplicationListTable
          list={list}
          handeAdditionalInfo={handeAdditionalInfo}
        />
      ) : (
        <CompareDuplicates
          goBack={goBack}
          handleButtonToggle={handleButtonToggle}
          compare={compare}
          rowData={rowData}
          combinedArray={combinedArray}
        />
      )}
    </Card>
  )
}
export default DeduplicationTableCard
