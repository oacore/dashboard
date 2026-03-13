import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DepositDatesActions {
  setDateRange: (startDate: string, endDate: string) => void;
  resetDateRange: () => void;
}

export interface DepositDatesStoreState {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

type DepositDatesStore = DepositDatesStoreState & DepositDatesActions;

const DEFAULT_START_DATE = '2021-01-01 00:00:00';
const TIME_SUFFIX = ' 00:00:00';

const getDefaultEndDate = (): string => {
  const today = new Date();
  return `${today.toISOString().split('T')[0]}${TIME_SUFFIX}`;
};

const formatDateWithTime = (date: string): string => {
  if (!date) return '';
  // If date already includes time, return as is
  if (date.includes(' ')) return date;
  // Otherwise, append time suffix
  return `${date}${TIME_SUFFIX}`;
};

const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate.split(' ')[0]);
  const end = new Date(endDate.split(' ')[0]);
  
  return start <= end;
};

export const useDepositDatesStore = create<DepositDatesStore>()(
  devtools(
    (set) => ({
      // Initial state
      dateRange: {
        startDate: DEFAULT_START_DATE,
        endDate: getDefaultEndDate(),
      },

      // Actions
      setDateRange: (startDate: string, endDate: string) => {
        const formattedStart = startDate ? formatDateWithTime(startDate) : DEFAULT_START_DATE;
        const formattedEnd = endDate ? formatDateWithTime(endDate) : getDefaultEndDate();

        // Validate date range
        if (!validateDateRange(formattedStart, formattedEnd)) {
          console.warn('Invalid date range: start date must be before or equal to end date');
          return;
        }

        set({
          dateRange: {
            startDate: formattedStart,
            endDate: formattedEnd,
          },
        });
      },

      resetDateRange: () => {
        set({
          dateRange: {
            startDate: DEFAULT_START_DATE,
            endDate: getDefaultEndDate(),
          },
        });
      },
    }),
    {
      name: 'deposit-dates-store',
    }
  )
);
