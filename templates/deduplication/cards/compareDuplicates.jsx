import React from 'react'

import InnerTable from '../tables/innerTable'
import ComparisonTable from '../tables/comparisonTable'
import InnerTableHeader from '../tables/innerTableHeader'

const CompareDuplicates = ({
  goBack,
  handleButtonToggle,
  compare,
  rowData,
  combinedArray,
  updateWork,
  outputsData,
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
          <InnerTable combinedArray={combinedArray} />
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
            outputsData={outputsData}
            combinedArray={combinedArray}
            worksDataInfo={worksDataInfo}
          />
        </>
      )}
    </>
  )
}

export default CompareDuplicates
