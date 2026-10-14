import { Checkbox } from 'antd';

import { useFreshFindsStore } from '../store/freshFindsStore';
import { useFreshFindsSettings } from '../hooks/useFreshFindsSettings';
import type { FreshFindsDepositFilter as DepositFilterValue } from '../types/data.types';

const DEPOSIT_FILTER_OPTIONS: { value: DepositFilterValue; label: string; pushOnly?: boolean }[] = [
  { value: 'automatic', label: 'Added automatically via FreshFinds', pushOnly: true },
  { value: 'manual', label: 'Added manually via FreshFinds', pushOnly: true },
  { value: 'available', label: 'Add to my repository' },
  { value: 'in_repository', label: 'In my repository' },
];

export const FreshFindsDepositFilter = () => {
  const { depositFilter, setDepositFilter } = useFreshFindsStore();
  const { formValues } = useFreshFindsSettings();
  const options = formValues?.integrationMode === 'pull'
    ? DEPOSIT_FILTER_OPTIONS.filter((option) => !option.pushOnly)
    : DEPOSIT_FILTER_OPTIONS;

  const handleFilterChange = (value: DepositFilterValue) => {
    const nextFilters = options
      .map((option) => option.value)
      .filter((optionValue) =>
        optionValue === value
          ? !depositFilter.includes(value)
          : depositFilter.includes(optionValue),
      );

    setDepositFilter(nextFilters);
  };

  return (
    <div
      className="fresh-finds-deposit-filter"
      role="group"
      aria-labelledby="fresh-finds-deposit-filter-label"
    >
      <span id="fresh-finds-deposit-filter-label" className="fresh-finds-deposit-filter__label">
        Only show papers:
      </span>
      <div className="fresh-finds-deposit-filter__options">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            className="fresh-finds-deposit-filter__option"
            checked={depositFilter.includes(option.value)}
            onChange={() => handleFilterChange(option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};
