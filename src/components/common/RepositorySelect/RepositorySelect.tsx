import React from 'react';
import { Select, Spin } from 'antd';
import {type RepositorySelectProps} from '@hooks/useDataProviders.ts';
import './styles.css';

const { Option } = Select;



export const RepositorySelect: React.FC<RepositorySelectProps> = ({
  dataProviders = [],
  isLoading = false,
  selectedDataProvider = null,
  onSelectChange,
  placeholder = 'Search repositories',
  showSearch = true,
}) => {
  return (
    <div className="container">
      <Select
        id="repository"
        className="repository-select"
        showSearch={showSearch}
        placeholder={placeholder}
        value={selectedDataProvider?.id != null ? selectedDataProvider.id.toString() : undefined}
        onChange={(value) => {
          const provider = dataProviders.find((p) => p.id.toString() === value);
          onSelectChange?.(provider ?? null);
        }}
        optionFilterProp="label"
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
        }
        loading={isLoading}
        allowClear={false}
        style={{ width: '100%' }}
        notFoundContent={isLoading ? <Spin size="small" /> : 'No repositories found'}
      >
        {dataProviders.map((provider) => (
          <Option key={provider.id} value={provider.id.toString()} label={provider.name}>
            {provider.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default RepositorySelect;
