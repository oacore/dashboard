import React from 'react';
import { Button } from 'antd';
import externalLinkIcon from '@/assets/icons/externalLink.svg';
import type { PublicReleaseDatesItem } from '../store/publicReleaseDatesStore';
import { SiderBase } from '@/components/common/CrSider/components/SiderBase';
import '@/components/common/CrSider/styles.css';

interface PublicReleaseDatesSiderProps {
  record: PublicReleaseDatesItem;
  className?: string;
  id?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onClick?: (event: React.MouseEvent) => void;
}

export const PublicReleaseDatesSider: React.FC<PublicReleaseDatesSiderProps> = ({
  record,
  className,
  id,
  isOpen = true,
  onClose,
  onClick,
}) => {
  const { title, authors, id: originalId } = record;
  const displayUrl = `https://core.ac.uk/display/${originalId}`;

  return (
    <SiderBase
      id={id}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      onClick={onClick}
    >
      <div className="cr-sider-body">
        <div className="oa-cr-sider-title">
          <b>{title}</b>
        </div>
        <div className="cr-sider-authors">
          {authors?.map((a) => a.name).join(' ')}
        </div>
      </div>

      <div className="cr-sider-footer">
        <Button
          type="primary"
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cr-sider-document-button"
          data-auto-close="true"
        >
          Open
          <img src={externalLinkIcon} alt="" className="cr-sider-external-icon" />
        </Button>
      </div>
    </SiderBase>
  );
};
