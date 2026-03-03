import React, { useMemo } from 'react';
import { Select, Spin } from 'antd';
import { type RepositorySelectProps } from '@hooks/useDataProviders.ts';
import './styles.css';

export const RepositorySelect: React.FC<RepositorySelectProps> = ({
  dataProviders = [],
  isLoading = false,
  selectedDataProvider = null,
  onSelectChange,
  placeholder = 'Search repositories',
  showSearch = true,
}) => {
  const options = useMemo(
    () =>
      dataProviders.map((provider) => ({
        label: provider.name,
        value: provider.id.toString(),
      })),
    [dataProviders]
  );

  return (
    <div className="container">
      <Select
        id="repository"
        className="repository-select"
        showSearch={
          showSearch
            ? {
              filterOption: (input: string, option?: { label?: React.ReactNode; value?: string }) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false,
            }
            : false
        }
        placeholder={placeholder}
        value={selectedDataProvider?.id != null ? selectedDataProvider.id.toString() : undefined}
        onChange={(value) => {
          const provider = dataProviders.find((p) => p.id.toString() === value);
          onSelectChange?.(provider ?? null);
        }}
        options={options}
        loading={isLoading}
        allowClear={false}
        style={{ width: '100%' }}
        notFoundContent={isLoading ? <Spin size="small" /> : 'No repositories found'}
      />
    </div>
  );
};

export default RepositorySelect;
