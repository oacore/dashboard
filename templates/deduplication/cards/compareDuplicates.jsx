import React from 'react'
import { observer } from 'mobx-react-lite'

import InnerTable from '../tables/innerTable'
import ComparisonTable from '../tables/comparisonTable'
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
    setCompare,
  }) => {
    const goBackPrevView = () => {
      setCompare(true)
    }

    return (
      <>
        {compare ? (
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
            />
          </>
        ) : (
          <>
            <InnerTableHeader
              onClick={goBackPrevView}
              handleButtonToggle={handleButtonToggle}
              compare={compare}
              rowData={rowData}
            />
            <ComparisonTable
              updateWork={updateWork}
              getDeduplicationInfo={getDeduplicationInfo}
              getOutputsData={getOutputsData}
              outputData={outputData}
              combinedArray={combinedArray}
              worksDataInfo={worksDataInfo}
              handleButtonToggle={handleButtonToggle}
              compare={compare}
            />
          </>
        )}
      </>
    )
  }
)

export default CompareDuplicates
