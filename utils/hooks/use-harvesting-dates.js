import React, { useEffect, useState } from 'react'

import groupDates from 'utils/dates'

const useHarvestingDate = (metadatadaHistory, type) => {
  const [activeType, setActiveType] = useState(type)
  const [barChartValues, setBarChartValues] = React.useState([])

  useEffect(() => {
    if (metadatadaHistory) {
      const monthHistory = groupDates(metadatadaHistory, activeType)
      setBarChartValues(monthHistory)
    }
  }, [metadatadaHistory])

  const onSetActiveType = (historyType) => {
    setActiveType(historyType)
    const values = groupDates(metadatadaHistory, historyType)
    setBarChartValues(values)
  }

  return {
    barChartValues,
    activeType,
    onSetActiveType,
  }
}

export default useHarvestingDate
