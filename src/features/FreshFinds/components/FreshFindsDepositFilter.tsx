import { Checkbox } from 'antd';

import { useFreshFindsStore } from '../store/freshFindsStore';
import type { FreshFindsDepositFilter as DepositFilterValue } from '../types/data.types';

const DEPOSIT_FILTER_OPTIONS: { value: DepositFilterValue; label: string }[] = [
  { value: 'automatic', label: 'Added automatically via FreshFinds' },
  { value: 'manual', label: 'Added manually via FreshFinds' },
  { value: 'available', label: 'Add to my repository' },
  { value: 'in_repository', label: 'In my repository' },
];

export const FreshFindsDepositFilter = () => {
  const { depositFilter, setDepositFilter } = useFreshFindsStore();

  const handleFilterChange = (value: DepositFilterValue) => {
    const nextFilters = DEPOSIT_FILTER_OPTIONS
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
        {DEPOSIT_FILTER_OPTIONS.map((option) => (
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
