import { useMemo } from 'react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const MIN_YEAR = 2012;
const DATE_FORMAT = 'YYYY-MM-DD';

export type DateRangePickerOutputFormat = 'date' | 'year';

interface CrDateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  outputFormat?: DateRangePickerOutputFormat;
}

const parseToDayjs = (str: string | undefined): Dayjs | null => {
  if (!str) return null;
  const part = str.split(' ')[0];
  if (!part) return null;
  const isYearOnly = part.length === 4 && /^\d{4}$/.test(part);
  const parsed = isYearOnly ? dayjs(`${part}-01-01`) : dayjs(part, DATE_FORMAT);
  return parsed.isValid() ? parsed : null;
};

export const CrDateRangePicker = ({
  onDateChange,
  initialStartDate,
  initialEndDate,
  outputFormat = 'date',
}: CrDateRangePickerProps) => {
  const value = useMemo(() => {
    const fallbackStart = outputFormat === 'year' ? `${MIN_YEAR}-01-01` : undefined;
    const fallbackEnd = outputFormat === 'year' ? dayjs().format(DATE_FORMAT) : undefined;
    const start = parseToDayjs(initialStartDate ?? fallbackStart);
    const end = parseToDayjs(initialEndDate ?? fallbackEnd);
    return start && end ? [start, end] as [Dayjs, Dayjs] : null;
  }, [initialStartDate, initialEndDate, outputFormat]);

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      const fmt = outputFormat === 'year' ? 'YYYY' : DATE_FORMAT;
      onDateChange(dates[0].format(fmt), dates[1].format(fmt));
    } else {
      onDateChange('', '');
    }
  };

  return (
    <div className="date-wrapper">
      <RangePicker
        format={DATE_FORMAT}
        value={value}
        onChange={handleChange}
        disabledDate={(d) => !!d && d.year() < MIN_YEAR}
        placeholder={['Start Date', 'End Date']}
      />
    </div>
  );
};
