import { useState, useEffect } from 'react';
import { setDatesByType, transformDates } from '../helpers/harvestingDateHelpers';

type HistoryEntry = { date: string; value: number };

export const useHarvestingDate = (
  metadatadaHistory: Record<string, number> | null | undefined,
  initialType: string
) => {
  const [activeType, setActiveType] = useState(initialType);
  const [barChartValues, setBarChartValues] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (metadatadaHistory) {
      const monthHistory = transformDates(metadatadaHistory);
      const activeDates = setDatesByType(
        monthHistory as Parameters<typeof setDatesByType>[0],
        activeType
      );
      setBarChartValues(activeDates);
    } else {
      setBarChartValues([]);
    }
  }, [metadatadaHistory, activeType]);

  const onSetActiveType = (historyType: string) => {
    setActiveType(historyType);
  };

  return {
    barChartValues,
    activeType,
    onSetActiveType,
  };
};
