import { DatePicker } from 'antd';
import type { GetProps } from 'antd';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

export const DateRangePicker = ({ onDateChange }: DateRangePickerProps) => {
  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      // Extract only the year from the selected dates
      onDateChange(dates[0].format('YYYY'), dates[1].format('YYYY'));
    } else {
      onDateChange('', '');
    }
  };

  return (
    <div className="date-wrapper">
      <RangePicker
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        disabledDate={(current) => current && current.isBefore('2012-01-01', 'day')}
        placeholder={['Start Date', 'End Date']}
      />
    </div>
  );
};
