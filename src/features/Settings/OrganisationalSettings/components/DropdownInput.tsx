import React, { useEffect, useRef } from 'react';
import { CrInput } from '@core/core-ui';
import '../styles.css';

interface RorSuggestion {
  id: string;
  name: string;
  names?: Array<{
    value: string;
    types?: string[];
  }>;
  [key: string]: unknown;
}

interface DropdownInputProps {
  label?: string;
  id?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  handleOptionClick?: () => void;
  isOpen?: boolean;
  suggestions?: RorSuggestion[];
  setRorId?: (id: string) => void;
  setRorName?: (name: string) => void;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const getRorDisplayName = (suggestion: RorSuggestion): string => {
  if (!suggestion.names || !Array.isArray(suggestion.names)) {
    return suggestion.name || '';
  }

  const rorDisplayName = suggestion.names.find(
    (nameItem) => nameItem.types && nameItem.types.includes('ror_display')
  );
  return rorDisplayName?.value || '';
};

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  id,
  name,
  onChange,
  value,
  handleOptionClick,
  isOpen,
  suggestions,
  setRorId,
  setRorName,
  defaultValue,
  required,
  placeholder,
  className,
}) => {
  const handleSuggestionClick = (suggestion: RorSuggestion) => {
    if (handleOptionClick) {
      handleOptionClick();
    }
    if (setRorId) {
      setRorId(suggestion.id);
    }
    const rorName = getRorDisplayName(suggestion);
    if (setRorName) {
      setRorName(rorName);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (handleOptionClick) {
          handleOptionClick();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleOptionClick]);

  const handleInputChange = (inputValue: string) => {
    if (onChange) {
      // Create a synthetic event-like object
      const syntheticEvent = {
        target: { value: inputValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };



  return (
    <div className={`dropdown-input ${className || ''}`} ref={dropdownRef}>
      <CrInput
        id={id}
        name={name}
        value={value}
        label={label}
        defaultValue={defaultValue}
        placeholder={placeholder || "Full name of your institution, e.g 'The Open University'"}
        className="modal-form-input-org"
        required={required}
        onChange={handleInputChange}
      />
      {isOpen && suggestions && suggestions.length > 0 && (
        <div className="dropdown-options">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Select ${name === 'rorName' ? getRorDisplayName(suggestion) : suggestion.id}`}
            >
              {name === 'rorName' ? getRorDisplayName(suggestion) : suggestion.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
