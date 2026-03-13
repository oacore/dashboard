import React from 'react';
import { Switch, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import classNames from 'classnames';
import '../styles.css';

interface NotificationOption {
  title: string;
  key: string;
}

interface NotificationProps {
  type: string;
  label: React.ReactNode;
  title: string;
  options: NotificationOption[];
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  handleOptionChange: (e: RadioChangeEvent) => void;
  name: string;
  image: string;
  dataProviderId?: number;
  updateNotificationsPending?: boolean;
  notificationsPending?: boolean;
  selectedOption: string;
}

export const NotificationCard: React.FC<NotificationProps> = ({
  label,
  title,
  options,
  checked,
  onChange,
  id,
  handleOptionChange,
  name,
  image,
  selectedOption,
  notificationsPending = false,
}) => {
  const isDisabled = notificationsPending;

  return (
    <div className="notification-container">
      <div className={classNames({ disabled: isDisabled })}>
        <Switch
          className="toggler"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
        />
        <label htmlFor={id} className="switch-label">
          {label}
        </label>
      </div>
      <span className="toggler-text">{title}</span>
      <div className="card-wrapper">
        <div>
          <Radio.Group
            className="option-wrapper"
            name={name}
            value={checked ? selectedOption : undefined}
            onChange={handleOptionChange}
            disabled={!checked || isDisabled}
          >
            {options.map((item) => (
              <Radio
                key={item.key}
                value={item.key}
                className="option"
                disabled={!checked || isDisabled}
              >
                <span className="notification-type-text">{item.title}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div>
          <img src={image} alt="notification" />
        </div>
      </div>
    </div>
  );
};
