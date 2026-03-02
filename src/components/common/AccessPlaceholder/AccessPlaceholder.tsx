import React from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import placeholderImg from '@/assets/icons/introMembership.svg';
import './styles.css';
import { useDashboardRoute } from '@hooks/useDashboardRoute';

interface AccessPlaceholderProps {
  screenHeight?: boolean;
  description: string;
  customWidth?: boolean;
}

export const AccessPlaceholder: React.FC<AccessPlaceholderProps> = ({
  screenHeight = false,
  description,
  customWidth = false,
}) => {
  const { buildPath } = useDashboardRoute();

  return (
    <div
      className={classNames('access-placeholder-wrapper', {
        'access-placeholder-height': screenHeight,
      })}
    >
      <img src={placeholderImg} alt="" />
      <Markdown
        className={classNames('access-placeholder-text', {
          'access-placeholder-custom-width': customWidth,
        })}
      >
        {description}
      </Markdown>
      <Button
        className="access-placeholder-upgrade-btn"
        type="primary"
        href={buildPath('membership-type')}
      >
        Upgrade
      </Button>
    </div>
  );
};
