import { useState, useCallback } from 'react';
import type { SwRow } from '@features/ResearchSoftware/types/sw.types';
import {
  CheckCircleFilled,
  CloseOutlined,
  LinkOutlined,
  EditFilled,
  CaretRightOutlined,
} from '@ant-design/icons';
import { Button } from "antd";
import { NotificationModal } from './NotificationModal';
import { TextData } from '@features/ResearchSoftware/texts';

type Props = {
  row: SwRow
  onClose: () => void
}

export const SwSidebar = ({ row, onClose }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleApproveClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleButtonClose = useCallback(() => {
    setModalOpen(false);
  }, []);
  return (
    <div className="sw-sidebar">
      <div className="sw-sidebar-topbar">
        <div className="sw-sidebar-topbar-left">{row.oai}</div>
        <button
          type="button"
          className="sw-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="sw-sidebar-body">
        <h3 className="sw-sidebar-title">{row.title}</h3>

        {(Array.isArray(row.authors) ? row.authors.join(' ') : row.authors || '') && (
          <div className="sw-sidebar-authors">
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

      <div className="sw-sidebar-footer sw-sidebar-footer-fixed">
        <Button type="primary" className="sw-btn sw-btn-primary" onClick={handleApproveClick}>
          APPROVE AND SEND NOTIFICATION <CaretRightOutlined />
        </Button>

        <Button className="sw-btn sw-btn-secondary" onClick={onClose}>
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
    </div>
  )
}
