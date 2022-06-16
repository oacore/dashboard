import { useEffect, useState } from 'react'

import { transformDates, setDatesByType } from 'utils/dates'

const useHarvestingDate = (metadatadaHistory, initialType) => {
  const [activeType, setActiveType] = useState(initialType)
  const [barChartValues, setBarChartValues] = useState([])
  const [tranformedDates, setTransformedDates] = useState([])

  useEffect(() => {
    if (metadatadaHistory) {
      const monthHistory = transformDates(metadatadaHistory)
      setTransformedDates(monthHistory)
      const activeDates = setDatesByType(monthHistory, activeType)
      setBarChartValues(activeDates)
    }
  }, [metadatadaHistory])

  const onSetActiveType = (historyType) => {
    setActiveType(historyType)
    const activeDates = setDatesByType(tranformedDates, historyType)
    setBarChartValues(activeDates)
  }

  return {
    barChartValues,
    activeType,
    onSetActiveType,
  }
}

export default useHarvestingDate
