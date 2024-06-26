import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import CompareCard from '../cards/compareCard'

const ComparisonTable = observer(
  ({
    combinedArray,
    updateWork,
    getOutputsData,
    worksDataInfo,
    outputData,
    getDeduplicationInfo,
    duplicateData,
  }) => {
    useEffect(() => {
      combinedArray.forEach((item) => {
        getOutputsData(item.documentId)
      })
    }, [])

    return (
      <>
        <CompareCard
          worksDataInfo={worksDataInfo}
          outputsDataInfo={outputData}
          updateWork={updateWork}
          getDeduplicationInfo={getDeduplicationInfo}
          combinedArray={combinedArray}
          duplicateData={duplicateData}
        />
      </>
    )
  }
)

export default ComparisonTable
