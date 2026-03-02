import React from 'react';
import { Select } from 'antd';
import "./styles.css"

const { Option } = Select;

type CrDocumentTogglerProps = {
  selectedOption: string;
  handleSelectChange: (value: string) => void;
  handleKeyDown: React.KeyboardEventHandler<HTMLElement>;
  optionsList: string[];
};

export const CrDocumentToggler: React.FC<CrDocumentTogglerProps> = ({
  selectedOption,
  handleSelectChange,
  handleKeyDown,
  optionsList,
}) => {
  return (
    <div className="nav-wrapper">
      <div className="nav-title">
        <span>CORE DOCUMENTATION:</span>
      </div>
      <div className="select-wrapper">
        <Select
          value={selectedOption}
          onChange={handleSelectChange}
          className="documentation-select"
          aria-label="Select documentation type"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {optionsList.map((option: string) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
