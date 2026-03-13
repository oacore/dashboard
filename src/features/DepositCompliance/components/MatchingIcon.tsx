import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { statusToCaption } from './utils';
import '../styles.css';

interface MatchingIconProps {
  status?: 'full' | 'partial' | 'none';
}

export const MatchingIcon: React.FC<MatchingIconProps> = ({ status }) => {
  if (!status || status === 'full') return null;

  const caption = statusToCaption(status);

  return (
    <span
      className={classNames('matching-icon', status)}
      title={caption || undefined}
      aria-label={caption || undefined}
    >
      <ExclamationCircleOutlined className={classNames('matching-icon-icon', status)} />
    </span>
  );
};
