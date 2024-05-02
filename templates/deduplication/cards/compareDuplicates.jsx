import React from 'react'
import { observer } from 'mobx-react-lite'

import InnerTable from '../tables/innerTable'
import InnerTableHeader from '../tables/innerTableHeader'

const CompareDuplicates = observer(
  ({
    goBack,
    handleButtonToggle,
    compare,
    rowData,
    combinedArray,
    updateWork,
    getOutputsData,
    outputData,
    getDeduplicationInfo,
    worksDataInfo,
    duplicateData,
  }) => (
    <>
      <InnerTableHeader
        onClick={goBack}
        handleButtonToggle={handleButtonToggle}
        compare={compare}
        rowData={rowData}
      />
      <InnerTable
        handleButtonToggle={handleButtonToggle}
        compare={compare}
        combinedArray={combinedArray}
        updateWork={updateWork}
        getDeduplicationInfo={getDeduplicationInfo}
        getOutputsData={getOutputsData}
        outputData={outputData}
        worksDataInfo={worksDataInfo}
        duplicateData={duplicateData}
      />
    </>
  )
)

export default CompareDuplicates
