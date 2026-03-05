import { useState, useCallback } from 'react';
import '@/components/common/CrSider/styles.css';
import {
  CheckCircleFilled,
  LinkOutlined,
  EditFilled,
  CaretRightOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { SwRow } from '@features/ResearchSoftware/types/sw.types';
import { CrSider } from '@components/common/CrSider';
import { NotificationModal } from '@features/ResearchSoftware/components/NotificationModal';
import { TextData } from '@features/ResearchSoftware/texts';

interface SwSiderProps {
  row: SwRow;
  onClose?: () => void;
  className?: string;
  id?: string;
  isOpen?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export const SwSider: React.FC<SwSiderProps> = ({
  row,
  onClose,
  className,
  id,
  isOpen = true,
  onClick,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleApproveClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleButtonClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <CrSider
      id={id}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      onClick={onClick}
    >
      <div className="cr-sider-body">
        <h3 className="sw-sidebar-title">{row.title}</h3>

        {(Array.isArray(row.authors) ? row.authors.join(' ') : row.authors || '') && (
          <div className="cr-sider-authors">
            {Array.isArray(row.authors) ? row.authors.join(' ') : row.authors || ''}
          </div>
        )}

        {(row.softwareCitations || []).length === 0 ? (
          <div className="sw-empty-card">
            No software citations found for this record.
          </div>
        ) : (
          <div className="sw-section-main">
            {(row.softwareCitations || []).map((citation, idx) => (
              <div key={idx} className="sw-citation-group">
                <div className="sw-card">
                  <div className="sw-card-head">
                    <span>Software name</span>
                    <CheckCircleFilled className="sw-check-icon" />
                  </div>
                  <div className="sw-card-value">
                    {citation.software || '-'}
                  </div>
                </div>
                <div className="sw-card">
                  <div className="sw-card-head">
                    <span>Software mention context</span>
                    <CheckCircleFilled className="sw-check-icon" />
                  </div>
                  <div className="sw-card-value sw-card-value-muted sw-context">
                    {citation.context || '-'}
                  </div>
                </div>
                <div className="sw-card">
                  <div className="sw-card-head">
                    <span>Mention type</span>
                    <CheckCircleFilled className="sw-check-icon" />
                  </div>
                  <div className="sw-mentionTypeWrapper">
                    <div className="sw-typeWrapper">
                      <p className="sw-mention-type">
                        <span className="sw-typeText">
                          {citation.type || '-'}
                        </span>
                        <EditFilled className="sw-mentionIcon" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sw-card">
                  <div className="sw-card-head">
                    <span>Software repository link</span>
                    <CheckCircleFilled className="sw-check-icon" />
                  </div>
                  <div className="sw-card-value">
                    {citation.url ? (
                      <a
                        className="sw-link"
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined className="sw-link-icon" />
                        {citation.url}
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
                <div className="sw-card">
                  <div className="sw-card-head">
                    <span>Confidence</span>
                    <CheckCircleFilled className="sw-check-icon" />
                  </div>
                  <div className="sw-card-value">
                    {citation.confidence ?? 66}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cr-sider-footer">
        <Button
          type="primary"
          className="cr-sider-document-button"
          onClick={handleApproveClick}
        >
          APPROVE AND SEND NOTIFICATION <CaretRightOutlined />
        </Button>

        <Button
          type="default"
          className="cr-sider-document-button"
          onClick={onClose}
        >
          CLOSE
        </Button>
      </div>

      {modalOpen && (
        <NotificationModal
          title={TextData.notificationModal.title}
          description={TextData.notificationModal.description}
          action={TextData.notificationModal.action}
          handleButtonClose={handleButtonClose}
        />
      )}
    </CrSider>
  );
};
