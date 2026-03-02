type HistoryEntry = { date: string; value: number };
type TransformedHistory = Record<string, Record<string, unknown>>;

const compareByString = (a: { date: string }, b: { date: string }): number => {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
};

const getLastHarvesting = (item: unknown): HistoryEntry | null => {
  if (item && typeof item === 'object' && 'lastHarvesting' in item) {
    return (item as { lastHarvesting: HistoryEntry }).lastHarvesting;
  }
  return null;
};

export const getDatesByMonth = (
  history: TransformedHistory
): HistoryEntry[] => {
  const dates: Record<string, unknown> = {};
  const historyKeys = Object.keys(history);
  if (historyKeys.length === 0) return [];

  const lastYear = history[historyKeys[historyKeys.length - 1]];
  const prevLastYear =
    historyKeys.length >= 2 ? history[historyKeys[historyKeys.length - 2]] : null;

  if (lastYear && Object.keys(lastYear).length < 12 && prevLastYear) {
    Object.assign(dates, prevLastYear, lastYear);
  } else if (lastYear) {
    Object.assign(dates, lastYear);
  }

  const lastDatesArray = Object.values(dates)
    .map(getLastHarvesting)
    .filter((entry): entry is HistoryEntry => entry != null);

  return lastDatesArray.sort(compareByString);
};

export const getDatesByHalfYear = (
  history: TransformedHistory
): HistoryEntry[] => {
  const lastDates = Object.values(
    Object.values(history).slice(-7) as Record<string, unknown>[]
  );

  const filteredData = lastDates.filter((item) =>
    item && typeof item === 'object' && Object.keys(item).some((key) => {
      const numericKey = parseInt(key, 10);
      return !Number.isNaN(numericKey) && numericKey > 6 && numericKey < 12;
    })
  );

  const halfYearDates = filteredData
    .map(getLastHarvesting)
    .filter((entry): entry is HistoryEntry => entry != null);

  return halfYearDates.sort(compareByString);
};

export const getDatesByYear = (
  history: TransformedHistory
): HistoryEntry[] => {
  const dates = Object.values(history).slice(-12);
  const lastDatesArray = dates
    .map(getLastHarvesting)
    .filter((entry): entry is HistoryEntry => entry != null);
  return lastDatesArray.sort(compareByString);
};

export const transformDates = (
  data: Record<string, number> | null | undefined
): TransformedHistory => {
  const arrayOfObj =
    data &&
    Object.entries(data).map(([date, value]) => ({
      date,
      value,
    }));

  if (!arrayOfObj || arrayOfObj.length === 0) {
    return Object.create(null);
  }

  const historyDates = arrayOfObj.reduce<TransformedHistory>((acc, obj) => {
    const parts = obj.date.split(/\D/);
    const year = parts[0];
    const month = parts[1] ?? '';
    const weekNum = `0${Math.ceil(parseInt(parts[2] ?? '1', 10) / 7)}`;

    if (!acc[year]) {
      acc[year] = {};
    }
    const yearObj = acc[year] as Record<string, unknown>;
    yearObj.lastHarvesting = obj;

    if (!yearObj[month]) {
      yearObj[month] = { lastHarvesting: obj };
    }
    const monthObj = yearObj[month] as Record<string, unknown>;
    monthObj.lastHarvesting = obj;

    if (!monthObj[weekNum]) {
      monthObj[weekNum] = [];
    }
    (monthObj[weekNum] as HistoryEntry[]).push(obj);

    return acc;
  }, Object.create(null));

  return historyDates;
};

export const setDatesByType = (
  initialDates: TransformedHistory,
  activeType: string
): HistoryEntry[] => {
  switch (activeType) {
    case 'Year':
      return getDatesByYear(initialDates);
    case 'Month':
      return getDatesByMonth(initialDates);
    case '6 months':
      return getDatesByHalfYear(initialDates);
    default:
      return [];
  }
};
