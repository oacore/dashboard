import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import fileCheckIcon from '@/assets/icons/file-check.svg';
import fileAlert from '@/assets/icons/file-alert.svg';
import externalLinkIcon from '@/assets/icons/externalLink.svg';
import earth from '@/assets/icons/earth.svg';
import type { ContentData } from '@features/Content/types/data.types.ts';
import { useWorkVisibility } from '@features/Content/hooks/useWorksData.ts';
import { formatDate } from '@utils/dateUtils.ts';
import { SiderDetailItem } from '@components/common/CrSider/components/SiderDetailItem.tsx';
import { CrSider } from '@components/common/CrSider';

interface ContentSiderProps {
  record: ContentData;
  className?: string;
  id?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onClick?: (event: React.MouseEvent) => void;
}

export const ContentSider: React.FC<ContentSiderProps> = ({
  record,
  className,
  id,
  isOpen = true,
  onClose,
  onClick,
}) => {
  const { changeVisibility, loading } = useWorkVisibility();
  const [isDisabled, setIsDisabled] = useState(record?.disabled ?? false);

  useEffect(() => {
    setIsDisabled(record?.disabled ?? false);
  }, [record?.disabled]);

  const handleTakeDown = async () => {
    if (!record) return;

    const newDisabledState = !isDisabled;
    setIsDisabled(newDisabledState);

    try {
      const workId = record.id;
      await changeVisibility(workId.toString());
      onClose?.();
    } catch (error) {
      console.error('Failed to change visibility:', error);
      setIsDisabled(isDisabled);
    }
  };

  const fullText = record.links.find((v) => v.type === 'download');
  const displayPage = record.links.find((v) => v.type === 'display');

  return (
    <CrSider
      id={id}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      onClick={onClick}
    >
      <div className="cr-sider-body">
        <div className="cr-sider-title">
          <b>{record.title}</b>
        </div>
        <div className="cr-sider-authors">
          {record.authors?.map((a) => a.name).join(', ')}
        </div>

        <div className="cr-sider-detail-list">
          <SiderDetailItem
            label="Full text"
            value={fullText ? 'Available' : 'Unavailable'}
            icon={fullText ? fileCheckIcon : fileAlert}
            isDanger={!fullText}
          />

          {record.identifiers?.doi && (
            <SiderDetailItem
              label="DOI"
              value={record.identifiers.doi}
            />
          )}

          <SiderDetailItem
            label="Update date"
            value={formatDate(record.lastUpdate)}
          />
        </div>
      </div>

      <div className="cr-sider-footer">
        <Button
          type="primary"
          href={fullText ? fullText.url : displayPage?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cr-sider-document-button"
          data-auto-close="true"
        >
          Open
          <img src={externalLinkIcon} alt="" className="cr-sider-external-icon" />
        </Button>

        <Button
          type="default"
          className="cr-sider-document-button"
          onClick={handleTakeDown}
          loading={loading}
          disabled={loading}
        >
          {!isDisabled ? (
            'Take down'
          ) : (
            <div className="restore-item">
              <img className="restore-icon" src={earth} alt="restore" />
              Restore
            </div>
          )}
        </Button>
      </div>
    </CrSider>
  );
};
