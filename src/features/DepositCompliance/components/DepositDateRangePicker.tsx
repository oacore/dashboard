import { DatePicker } from 'antd';
import type { GetProps } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const MIN_DATE = '2012-01-01';

interface DepositDateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const parseDateString = (dateStr?: string): Dayjs | null => {
  if (!dateStr) return null;

  // Extract date part (YYYY-MM-DD) from datetime string
  const datePart = dateStr.split(' ')[0];
  const parsed = dayjs(datePart, 'YYYY-MM-DD');

  return parsed.isValid() ? parsed : null;
};

export const DepositDateRangePicker = ({
  onDateChange,
  initialStartDate,
  initialEndDate,
}: DepositDateRangePickerProps) => {
  // Parse initial dates
  const initialDates = useMemo<[Dayjs | null, Dayjs | null] | null>(() => {
    const start = parseDateString(initialStartDate);
    const end = parseDateString(initialEndDate);

    if (start && end) {
      return [start, end];
    }

    return null;
  }, [initialStartDate, initialEndDate]);

  const [dateValues, setDateValues] = useState<[Dayjs | null, Dayjs | null] | null>(initialDates);

  // Update date values when initial dates change
  useEffect(() => {
    if (initialDates) {
      setDateValues(initialDates);
    }
  }, [initialDates]);

  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      setDateValues([dates[0], dates[1]]);
      onDateChange(startDate, endDate);
    } else {
      setDateValues(null);
      onDateChange('', '');
    }
  };

  const disabledDate = (current: Dayjs | null): boolean => {
    if (!current) return false;
    return current.isBefore(dayjs(MIN_DATE, 'YYYY-MM-DD'), 'day');
  };

  return (
    <div className="date-wrapper">
      <RangePicker
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        value={dateValues}
        disabledDate={disabledDate}
        placeholder={['Start Date', 'End Date']}
      />
    </div>
  );
};
